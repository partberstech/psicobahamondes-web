import { NextRequest, NextResponse } from 'next/server'
import { sendConfirmationEmail, sendAdminNotification, sendReportWithPdf } from '@/lib/email'
import { getSlotsFromConfig, getBusyTimesForDate, SESSION_CONFIG, type SessionType } from '@/lib/availability'
import { getDb, migrate, queryBookedTimes, saveContact } from '@/lib/db'
import { v4 as uuid } from 'uuid'
import { eneagramaReportTemplate } from '@/lib/eneagrama-email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionType, name, email, phone, date, time, eneagramaData } = body

    if (!sessionType || !name || !email || !phone || !date || !time) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 })
    }
    if (!['sesion-cero', 'consulta-presencial', 'consulta-telematica'].includes(sessionType)) {
      return NextResponse.json({ error: 'Tipo de sesión inválido' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }
    if (!/^(\+?56)?9\d{8}$/.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json({ error: 'Teléfono inválido — debe ser un número chileno (+569XXXXXXXX)' }, { status: 400 })
    }

    const config = SESSION_CONFIG[sessionType as SessionType]
    if (!config) {
      return NextResponse.json({ error: 'Configuración de horario no encontrada' }, { status: 400 })
    }

    // Validate slot time against config AND existing bookings/Calendar events
    const [bookedFromDb, busyFromCalendar] = await Promise.all([
      queryBookedTimes(date, sessionType as SessionType),
      getBusyTimesForDate(date),
    ])
    const allBooked = new Set<string>()
    bookedFromDb.forEach(t => allBooked.add(t))
    busyFromCalendar.forEach(t => allBooked.add(t))
    const validSlots = getSlotsFromConfig(sessionType as SessionType, date, allBooked)
    const matching = validSlots.find((s) => s.time === time)
    if (!matching) {
      return NextResponse.json({ error: 'Horario no disponible para esta fecha' }, { status: 400 })
    }
    if (!matching.available) {
      return NextResponse.json({ error: 'Este horario ya está reservado. Por favor elige otro.' }, { status: 409 })
    }

    // Try DB save (fails silently — email is the fallback)
    let dbId = uuid()
    let savedToDb = false
    if (process.env.TURSO_DATABASE_URL) {
      try {
        await migrate()
        const db = getDb()
        await db.execute({
          sql: `INSERT INTO bookings (id, session_type, name, email, phone, date, time, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed')`,
          args: [dbId, sessionType, name, email, phone, date, time],
        })
        savedToDb = true

        // Save contact to contacts DB
        await saveContact({
          name, email, phone, source: sessionType, bookingId: dbId,
        })
      } catch {
        // DB unavailable — booking handled via email
      }
    }

    // Create Google Calendar event + get Meet link (fire-and-forget, don't block emails)
    let meetLink: string | null = null
    try {
      const { createBookingEvent } = await import('@/lib/google-calendar')
      const calPromise = createBookingEvent({
        summary: `${config.label} — ${name}`,
        description: `Consulta agendada desde la web\n\nNombre: ${name}\nEmail: ${email}\nTeléfono: ${phone}\nTipo: ${config.label}`,
        date,
        time,
        durationMinutes: config.slotMinutes,
        attendeeEmail: email,
        sessionType,
      })
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Calendar timeout')), 8000)
      )
      // Race but don't block — catch silently
      Promise.race([calPromise, timeoutPromise])
        .then((result) => {
          meetLink = result.meetLink || null
          // If we got a Meet link, send a follow-up email with it
          if (meetLink) {
            const withLink = { name, email, phone, sessionType, date, time, meetLink }
            Promise.all([
              sendConfirmationEmail(withLink),
              sendAdminNotification(withLink),
            ]).catch(() => {})
          }
        })
        .catch((err) => console.error('[booking] calendar/meet error:', err?.message || err))
    } catch (err) {
      console.error('[booking] calendar import error:', err)
    }

    // Send confirmation emails FIRST
    const bookingData = { name, email, phone, sessionType, date, time }

    if (!savedToDb) {
      const results = await Promise.all([
        sendConfirmationEmail(bookingData),
        sendAdminNotification(bookingData),
      ])
      if (!results.some(Boolean)) {
        return NextResponse.json({
          error: 'No pudimos procesar tu agendamiento. Escríbenos directamente a contacto@psicobahamondes.cl',
        }, { status: 503 })
      }
    } else {
      await Promise.all([
        sendConfirmationEmail(bookingData),
        sendAdminNotification(bookingData),
      ])
    }

    // ── If eneagrama test data is present, generate & send PDF report ──
    let reportSent = false
    if (eneagramaData && sessionType === 'sesion-cero') {
      try {
        const pdfBase64 = await generatePdfBase64(eneagramaData)
        const html = eneagramaReportTemplate(eneagramaData)
        reportSent = await sendReportWithPdf(
          [process.env.ADMIN_EMAIL || 'psicobahamondes@gmail.com', 'contactopartnerstech@gmail.com'],
          { nombre: eneagramaData.nombre, email: eneagramaData.email, sessionType },
          html,
          pdfBase64,
        )
        if (!reportSent) {
          console.error('[booking] report send failed (Resend returned non-ok)')
        }
      } catch (err) {
        console.error('[booking] report generation/send error:', err)
        reportSent = false
      }
    }

    return NextResponse.json({
      success: true,
      id: dbId,
      reportSent,
      message: savedToDb
        ? 'Consulta agendada exitosamente'
        : 'Te enviamos la confirmación por correo. Si no lo ves, revisa spam.',
    })
  } catch (err: any) {
    console.error('[booking] error:', err)
    return NextResponse.json({ error: 'Error al agendar. Intenta de nuevo.' }, { status: 500 })
  }
}

export async function GET() {
  if (!process.env.TURSO_DATABASE_URL) {
    return NextResponse.json({ bookings: [], note: 'DB not configured — no persisted bookings' })
  }
  try {
    await migrate()
    const db = getDb()
    const rows = await db.execute(
      'SELECT * FROM bookings ORDER BY date DESC, time DESC LIMIT 100'
    )
    return NextResponse.json({ bookings: rows.rows })
  } catch {
    return NextResponse.json({ bookings: [], note: 'DB unavailable' })
  }
}

// ─── PDF generation (inline to avoid webpack bundling of pdf-lib) ───

async function generatePdfBase64(data: Record<string, any>): Promise<string> {
  // eval('require') bypasses webpack bundling — this runs runtime-only on Node.js
  const { PDFDocument, StandardFonts, rgb }: typeof import('pdf-lib') = eval('require("pdf-lib")')

  const font = 'Helvetica' as any
  const bold = 'Helvetica-Bold' as any
  const italic = 'Helvetica-Oblique' as any

  const doc = await PDFDocument.create()
  const helvetica = await doc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold)
  const helveticaItalic = await doc.embedFont(StandardFonts.HelveticaOblique)

  const page = doc.addPage([612, 792])
  let y = 792 - 50
  const MARGIN = 50
  const CONTENT_W = 612 - 100
  const INK = rgb(0.067, 0.094, 0.153)
  const MUTED = rgb(0.42, 0.44, 0.47)
  const MUTED_LIGHT = rgb(0.61, 0.63, 0.66)
  const BRAND = rgb(0.145, 0.39, 0.925)
  const BRAND_LIGHT = rgb(0.859, 0.918, 1)
  const WHITE = rgb(1, 1, 1)
  const BORDER = rgb(0.898, 0.906, 0.91)
  const RED = rgb(0.863, 0.149, 0.149)
  const GREEN = rgb(0.086, 0.639, 0.212)
  const ORANGE = rgb(0.918, 0.345, 0.047)

  // ── Header ──
  page.drawRectangle({ x: MARGIN, y, width: CONTENT_W, height: 4, color: BRAND })
  y -= 18
  page.drawText('Psicobahamondes — Reporte de Eneagrama', { x: MARGIN, y, size: 16, font: helveticaBold, color: INK })
  y -= 22
  page.drawText(`Paciente: ${data.nombre}`, { x: MARGIN, y, size: 10, font: helvetica, color: MUTED })
  y -= 14
  page.drawText(`Email: ${data.email} · Tel: ${data.telefono || 'No proporcionado'}`, { x: MARGIN, y, size: 9, font: helvetica, color: MUTED_LIGHT })
  y -= 14
  page.drawText(`Fecha: ${new Date(data.timestamp).toLocaleString('es-CL', { dateStyle: 'full', timeStyle: 'short' })}`, { x: MARGIN, y, size: 9, font: helvetica, color: MUTED_LIGHT })
  y -= 12
  page.drawRectangle({ x: MARGIN, y, width: CONTENT_W, height: 1, color: BORDER })
  y -= 20

  // ── TYPES DATA ──
  const TYPES_FULL = [
    { id: 1, emoji: '🔹', title: 'El Reformador', center: 'Instintivo', centerHex: '#2563eb',
      coreFear: 'Ser malo/a, defectuoso/a o corrupto/a', coreDesire: 'Ser bueno/a, íntegro/a y equilibrado/a',
      strengths: ['Integridad moral', 'Capacidad de mejora', 'Responsabilidad', 'Visión clara'],
      challenges: ['Autocrítica excesiva', 'Rigidez', 'Juicio hacia otros', 'Perfeccionismo'],
      stress: { type: 4, name: 'Hacia el Individualista' }, growth: { type: 7, name: 'Hacia el Entusiasta' },
      wings: ['1w9 — El Idealista (más tranquilo, filosófico)', '1w2 — El Defensor (más cálido, orientado a personas)'] },
    { id: 2, emoji: '💙', title: 'El Ayudador', center: 'Emocional', centerHex: '#8b5cf6',
      coreFear: 'No ser amado/a o no ser deseado/a', coreDesire: 'Sentirse amado/a y apreciado/a',
      strengths: ['Empatía profunda', 'Generosidad sincera', 'Conexión humana', 'Apoyo incondicional'],
      challenges: ['Descuido propio', 'Necesidad de aprobación', 'Orgullo encubierto', 'Dependencia emocional'],
      stress: { type: 8, name: 'Hacia el Desafiador' }, growth: { type: 4, name: 'Hacia el Individualista' },
      wings: ['2w1 — El Asistente (más principioso, correcto)', '2w3 — El Anfitrión (más ambicioso, orientado a imagen)'] },
    { id: 3, emoji: '🏆', title: 'El Triunfador', center: 'Emocional', centerHex: '#8b5cf6',
      coreFear: 'No tener valor, ser insignificante', coreDesire: 'Sentirse valioso/a y digno/a',
      strengths: ['Determinación', 'Capacidad de inspirar', 'Adaptabilidad', 'Excelencia'],
      challenges: ['Identificación con la imagen', 'Temor al fracaso', 'Competitividad', 'Desconexión emocional'],
      stress: { type: 9, name: 'Hacia el Pacificador' }, growth: { type: 6, name: 'Hacia el Leal' },
      wings: ['3w2 — El Vendedor (más carismático, orientado a personas)', '3w4 — El Profesional (más creativo, introspectivo)'] },
    { id: 4, emoji: '🎨', title: 'El Individualista', center: 'Emocional', centerHex: '#8b5cf6',
      coreFear: 'No tener identidad personal o significado', coreDesire: 'Encontrar su identidad e importancia',
      strengths: ['Creatividad profunda', 'Compasión', 'Honestidad emocional', 'Originalidad'],
      challenges: ['Melancolía', 'Autoabsorción', 'Envidia', 'Inestabilidad emocional'],
      stress: { type: 2, name: 'Hacia el Ayudador' }, growth: { type: 1, name: 'Hacia el Reformador' },
      wings: ['4w3 — El Artista (más orientado a logros, adaptable)', '4w5 — El Bohemio (más introspectivo, analítico)'] },
    { id: 5, emoji: '🔍', title: 'El Investigador', center: 'Mental', centerHex: '#059669',
      coreFear: 'Ser inútil, incompetente o incapaz', coreDesire: 'Ser capaz y competente',
      strengths: ['Pensamiento visionario', 'Mente abierta', 'Independencia', 'Profundidad analítica'],
      challenges: ['Aislamiento', 'Retención', 'Desapego', 'Evitación emocional'],
      stress: { type: 7, name: 'Hacia el Entusiasta' }, growth: { type: 8, name: 'Hacia el Desafiador' },
      wings: ['5w4 — El Iconoclasta (más creativo, individualista)', '5w6 — El Solucionador (más leal, orientado a seguridad)'] },
    { id: 6, emoji: '🛡️', title: 'El Leal', center: 'Mental', centerHex: '#059669',
      coreFear: 'No tener guía, apoyo o capacidad de sobrevivir', coreDesire: 'Tener seguridad y apoyo',
      strengths: ['Lealtad inquebrantable', 'Responsabilidad', 'Coraje real', 'Confianza'],
      challenges: ['Ansiedad', 'Desconfianza', 'Duda', 'Rebeldía'],
      stress: { type: 3, name: 'Hacia el Triunfador' }, growth: { type: 9, name: 'Hacia el Pacificador' },
      wings: ['6w5 — El Defensor (más analítico, privado)', '6w7 — El Bufón (más sociable, optimista)'] },
    { id: 7, emoji: '⚡', title: 'El Entusiasta', center: 'Mental', centerHex: '#059669',
      coreFear: 'Estar en dolor o privación', coreDesire: 'Ser feliz y satisfecho',
      strengths: ['Optimismo contagioso', 'Versatilidad', 'Creatividad', 'Energía'],
      challenges: ['Dispersión', 'Evitación del dolor', 'Superficialidad', 'Impulsividad'],
      stress: { type: 1, name: 'Hacia el Reformador' }, growth: { type: 5, name: 'Hacia el Investigador' },
      wings: ['7w6 — El Buddy (más leal, orientado a seguridad)', '7w8 — El Realizador (más asertivo, directo)'] },
    { id: 8, emoji: '💪', title: 'El Desafiador', center: 'Instintivo', centerHex: '#2563eb',
      coreFear: 'Ser controlado, herido o violado por otros', coreDesire: 'Protegerse a sí mismo y a otros',
      strengths: ['Liderazgo natural', 'Determinación', 'Protección', 'Directo y honesto'],
      challenges: ['Dominación', 'Confrontación', 'Intimidación', 'Vulnerabilidad'],
      stress: { type: 5, name: 'Hacia el Investigador' }, growth: { type: 2, name: 'Hacia el Ayudador' },
      wings: ['8w7 — El Independiente (más sociable, espontáneo)', '8w9 — El Oso (más tranquilo, pacífico)'] },
    { id: 9, emoji: '☮️', title: 'El Pacificador', center: 'Instintivo', centerHex: '#2563eb',
      coreFear: 'Pérdida y separación, desintegración', coreDesire: 'Paz interior y totalidad',
      strengths: ['Armonía', 'Estabilidad', 'Empatía', 'Mediación'],
      challenges: ['Complacencia', 'Evitación del conflicto', 'Pasividad', 'Indecisión'],
      stress: { type: 6, name: 'Hacia el Leal' }, growth: { type: 3, name: 'Hacia el Triunfador' },
      wings: ['9w8 — El Árbitro (más asertivo, directo)', '9w1 — El Soñador (más creativo, introspectivo)'] },
  ]

  function centerMapHex(c: string): string {
    if (c === 'Instintivo') return '#2563eb'
    if (c === 'Emocional') return '#8b5cf6'
    return '#059669'
  }

  function hexToRgb(hex: string): any {
    const c = hex.replace('#', '')
    return rgb(parseInt(c.substring(0, 2), 16) / 255, parseInt(c.substring(2, 4), 16) / 255, parseInt(c.substring(4, 6), 16) / 255)
  }

  const totalAnswered = (Object.values(data.scores) as number[]).reduce((a, b) => a + b, 0)
  const sorted = Object.entries(data.scores).map(([id, score]) => ({ id: Number(id), score: score as number })).sort((a, b) => b.score - a.score)
  const topType = TYPES_FULL.find(t => t.id === data.tipoPredominante) || TYPES_FULL[0]
  const wingLabel = data.ala ? `${data.tipoPredominante}w${data.ala}` : 'No detectada'

  // Section title helper
  function sectionTitle(text: string): void {
    page.drawRectangle({ x: MARGIN, y: y - 2, width: CONTENT_W, height: 22, color: BRAND_LIGHT })
    page.drawText(text, { x: MARGIN + 12, y: y + 4, size: 11, font: helveticaBold, color: BRAND })
    y -= 32
  }

  // ── Primary type ──
  sectionTitle(`TIPO PREDOMINANTE: ${topType.title} (Tipo ${data.tipoPredominante})`)
  y -= 4
  page.drawText(`Centro: ${topType.center} · Ala: ${wingLabel}`, { x: MARGIN, y, size: 10, font: helveticaItalic, color: MUTED })
  y -= 20

  // ── Bar chart ──
  sectionTitle('DISTRIBUCIÓN DE PUNTUACIONES')
  const barStartX = MARGIN + 60
  const barMaxW = CONTENT_W - 100
  const barHeight = 13
  const barGap = 3

  for (const { id, score } of sorted) {
    const t = TYPES_FULL.find(x => x.id === id)
    if (!t) continue
    const pct = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0
    const isTop = id === data.tipoPredominante
    const barColor = isTop ? hexToRgb(centerMapHex(t.center)) : hexToRgb('#c4c4c4')
    const barW = Math.max((pct / 100) * barMaxW, 2)
    page.drawText(`Tipo ${id} ${t.emoji}`, { x: MARGIN, y: y - 1, size: 8, font: isTop ? helveticaBold : helvetica, color: isTop ? INK : MUTED })
    page.drawRectangle({ x: barStartX, y: y - 2, width: barMaxW, height: barHeight, color: hexToRgb('#f2f2f3') })
    page.drawRectangle({ x: barStartX, y: y - 2, width: barW, height: barHeight, color: barColor })
    page.drawText(`${pct}%`, { x: barStartX + barMaxW + 4, y: y - 1, size: 8, font: helveticaBold, color: isTop ? INK : MUTED })
    y -= (barHeight + barGap)
  }

  y -= 10

  // ── Fear & Desire ──
  sectionTitle('ANÁLISIS DEL TIPO')
  const colW = (CONTENT_W - 12) / 2

  page.drawRectangle({ x: MARGIN, y: y - 52, width: colW, height: 48, color: hexToRgb('#fef2f2') })
  page.drawRectangle({ x: MARGIN, y: y - 52, width: colW, height: 48, borderColor: hexToRgb('#fca5a5'), borderWidth: 1 })
  page.drawText('MIEDO CENTRAL', { x: MARGIN + 10, y: y - 12, size: 8, font: helveticaBold, color: RED })
  page.drawText(topType.coreFear, { x: MARGIN + 10, y: y - 30, size: 8, font: helvetica, color: MUTED, maxWidth: colW - 20 })

  page.drawRectangle({ x: MARGIN + colW + 12, y: y - 52, width: colW, height: 48, color: hexToRgb('#f0fdf4') })
  page.drawRectangle({ x: MARGIN + colW + 12, y: y - 52, width: colW, height: 48, borderColor: hexToRgb('#86efac'), borderWidth: 1 })
  page.drawText('DESEO CENTRAL', { x: MARGIN + colW + 22, y: y - 12, size: 8, font: helveticaBold, color: GREEN })
  page.drawText(topType.coreDesire, { x: MARGIN + colW + 22, y: y - 30, size: 8, font: helvetica, color: MUTED, maxWidth: colW - 20 })

  y -= 60

  // ── Strengths & Challenges ──
  page.drawRectangle({ x: MARGIN, y: y - 72, width: colW, height: 68, color: hexToRgb('#f0f7ff') })
  page.drawRectangle({ x: MARGIN, y: y - 72, width: colW, height: 68, borderColor: hexToRgb('#93c5fd'), borderWidth: 1 })
  page.drawText('FORTALEZAS', { x: MARGIN + 10, y: y - 14, size: 8, font: helveticaBold, color: hexToRgb('#2563eb') })
  topType.strengths.forEach((s: string, i: number) => {
    page.drawText(`✦ ${s}`, { x: MARGIN + 10, y: y - 32 - i * 12, size: 7.5, font: helvetica, color: MUTED, maxWidth: colW - 20 })
  })

  page.drawRectangle({ x: MARGIN + colW + 12, y: y - 72, width: colW, height: 68, color: hexToRgb('#fff7ed') })
  page.drawRectangle({ x: MARGIN + colW + 12, y: y - 72, width: colW, height: 68, borderColor: hexToRgb('#fdba74'), borderWidth: 1 })
  page.drawText('DESAFÍOS', { x: MARGIN + colW + 22, y: y - 14, size: 8, font: helveticaBold, color: ORANGE })
  topType.challenges.forEach((c: string, i: number) => {
    page.drawText(`✦ ${c}`, { x: MARGIN + colW + 22, y: y - 32 - i * 12, size: 7.5, font: helvetica, color: MUTED, maxWidth: colW - 20 })
  })

  y -= 80

  // ── Stress & Growth ──
  page.drawRectangle({ x: MARGIN, y: y - 44, width: colW, height: 40, color: hexToRgb('#fdf4f0') })
  page.drawRectangle({ x: MARGIN, y: y - 44, width: colW, height: 40, borderColor: BORDER, borderWidth: 1 })
  page.drawText(`ESTRÉS → Tipo ${topType.stress.type}`, { x: MARGIN + 10, y: y - 14, size: 8, font: helveticaBold, color: RED })
  page.drawText(topType.stress.name, { x: MARGIN + 10, y: y - 30, size: 8, font: helvetica, color: MUTED })

  page.drawRectangle({ x: MARGIN + colW + 12, y: y - 44, width: colW, height: 40, color: hexToRgb('#edf5f2') })
  page.drawRectangle({ x: MARGIN + colW + 12, y: y - 44, width: colW, height: 40, borderColor: BORDER, borderWidth: 1 })
  page.drawText(`CRECIMIENTO → Tipo ${topType.growth.type}`, { x: MARGIN + colW + 22, y: y - 14, size: 8, font: helveticaBold, color: GREEN })
  page.drawText(topType.growth.name, { x: MARGIN + colW + 22, y: y - 30, size: 8, font: helvetica, color: MUTED })

  y -= 52

  // ── Enneagram Circle ──
  if (y < 300) {
    doc.addPage([612, 792])
    y = 792 - 50
  }
  sectionTitle('ENEAGRAMA — Distribución de los 9 tipos')
  y -= 6

  const ecx = MARGIN + CONTENT_W / 2
  const ecy = y - 80
  const er = 70

  page.drawCircle({ x: ecx, y: ecy, size: er, borderColor: hexToRgb('#ccc'), borderWidth: 1 })

  const typePos: Record<number, { x: number; y: number }> = {}
  for (let tp = 1; tp <= 9; tp++) {
    const pos = tp % 9
    const angle = (pos * 40 - 90) * (Math.PI / 180)
    typePos[tp] = { x: ecx + er * Math.cos(angle), y: ecy + er * Math.sin(angle) }
  }

  const triPts = [3, 6, 9].map(t => typePos[t])
  page.drawLine({ start: triPts[0], end: triPts[1], color: hexToRgb('rgba(37,99,235,0.3)'), thickness: 1 })
  page.drawLine({ start: triPts[1], end: triPts[2], color: hexToRgb('rgba(37,99,235,0.3)'), thickness: 1 })
  page.drawLine({ start: triPts[2], end: triPts[0], color: hexToRgb('rgba(37,99,235,0.3)'), thickness: 1 })

  const hexPath = [1, 4, 2, 8, 5, 7, 1]
  for (let i = 0; i < hexPath.length - 1; i++) {
    page.drawLine({ start: typePos[hexPath[i]], end: typePos[hexPath[i + 1]], color: hexToRgb('rgba(139,92,246,0.3)'), thickness: 1 })
  }

  for (let tp = 1; tp <= 9; tp++) {
    const pos = typePos[tp]
    const t = TYPES_FULL.find(x => x.id === tp)
    const isTop = tp === data.tipoPredominante
    const cc = t ? hexToRgb(centerMapHex(t.center)) : BRAND
    const dotR = isTop ? 8 : 5
    const pos2 = tp % 9
    const angle = (pos2 * 40 - 90) * (Math.PI / 180)
    const labelR = er + 16
    const lx = ecx + labelR * Math.cos(angle)
    const ly = ecy + labelR * Math.sin(angle)

    if (isTop) {
      page.drawCircle({ x: pos.x, y: pos.y, size: 12, color: hexToRgb('rgba(37,99,235,0.08)') })
    }
    page.drawCircle({ x: pos.x, y: pos.y, size: dotR, color: isTop ? cc : hexToRgb('#d1d5db') })
    page.drawCircle({ x: pos.x, y: pos.y, size: dotR, borderColor: WHITE, borderWidth: 1.5 })
    page.drawText(`T${tp}`, { x: lx - 5, y: ly - 3, size: 7, font: isTop ? helveticaBold : helvetica, color: isTop ? cc : MUTED })
  }

  y = ecy - er - 20

  // ── Clinical Report ──
  if (y < 100) {
    doc.addPage([612, 792])
    y = 792 - 50
  }
  sectionTitle('ANÁLISIS CLÍNICO COMPLETO')
  y -= 6

  const { getProfileByType } = await import('@/lib/eneagrama-profiles')
  const profile = getProfileByType(data.tipoPredominante)
  if (profile) {
    const lines = profile.fullReport.split('\n')
    for (const line of lines) {
      if (line.trim() === '') { y -= 10; continue }
      const isHeader = /^(ANÁLISIS|DESCRIPCIÓN|MIEDO|DESEO|PATRONES|DINÁMICA|ALAS|ÁREAS|NOTE)/.test(line)
      if (y < 40) {
        doc.addPage([612, 792])
        y = 792 - 50
      }
      page.drawText(line, { x: MARGIN, y, size: isHeader ? 9 : 7.5, font: isHeader ? helveticaBold : helvetica, color: isHeader ? INK : MUTED, maxWidth: CONTENT_W })
      y -= (isHeader ? 16 : 11)
    }
  }

  // ── Footer ──
  y -= 8
  if (y < 50) {
    doc.addPage([612, 792])
    y = 792 - 50
  }
  page.drawRectangle({ x: MARGIN, y: y - 24, width: CONTENT_W, height: 24, color: hexToRgb('#f9fafb') })
  page.drawText('📌 Nota clínica: Este test es orientativo. El análisis completo del perfil eneagramático se realiza en sesión.', { x: MARGIN + 10, y: y - 5, size: 7, font: helveticaItalic, color: MUTED, maxWidth: CONTENT_W - 20 })

  y -= 12
  page.drawRectangle({ x: MARGIN, y, width: CONTENT_W, height: 1, color: BORDER })
  y -= 14
  page.drawText('Psicobahamondes · Pedro Bahamondes · Psicólogo Clínico · psicobahamondes.cl', { x: MARGIN, y, size: 7, font: helvetica, color: MUTED_LIGHT })

  const pdfBytes = await doc.save()
  let binary = ''
  const bytes = new Uint8Array(pdfBytes)
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}
