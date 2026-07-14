// ─── Email Template — Eneagrama Report for Psychologist ───

const BRAND = '#2563eb'
const BRAND_DARK = '#1d4ed8'
const INK = '#111827'
const INK_SOFT = '#374151'
const MUTED = '#6b7280'
const MUTED_LIGHT = '#9ca3af'
const BG = '#ffffff'
const SURFACE = '#f9fafb'
const BORDER = '#e5e7eb'

// ─── Wing name map ───
const WING_NAMES: Record<string, string> = {
  '1w9': 'El Idealista',
  '1w2': 'El Abogado',
  '2w1': 'El Servidor',
  '2w3': 'El Anfitrión',
  '3w2': 'La Estrella',
  '3w4': 'El Profesional',
  '4w3': 'El Aristócrata',
  '4w5': 'El Bohemio',
  '5w4': 'El Iconoclasta',
  '5w6': 'El Solucionador',
  '6w5': 'El Guerrero',
  '6w7': 'El Compañero',
  '7w6': 'El Animador',
  '7w8': 'El Realista',
  '8w7': 'El Independiente',
  '8w9': 'El Oso',
  '9w8': 'El Árbitro',
  '9w1': 'El Soñador',
}

// ─── Full type data for email report ───
const TYPES_FULL = [
  {
    id: 1, emoji: '🔹', title: 'El Reformador', center: 'Instintivo',
    coreFear: 'Ser malo/a, defectuoso/a o corrupto/a',
    coreDesire: 'Ser bueno/a, íntegro/a y equilibrado/a',
    strengths: ['Integridad moral', 'Capacidad de mejora', 'Responsabilidad', 'Visión clara'],
    challenges: ['Autocrítica excesiva', 'Rigidez', 'Juicio hacia otros', 'Perfeccionismo'],
    stress: { type: 4, name: 'Hacia el Individualista' },
    growth: { type: 7, name: 'Hacia el Entusiasta' },
    wings: ['1w9 — El Idealista (más tranquilo, filosófico)', '1w2 — El Defensor (más cálido, orientado a personas)'],
  },
  {
    id: 2, emoji: '💙', title: 'El Ayudador', center: 'Emocional',
    coreFear: 'No ser amado/a o no ser deseado/a',
    coreDesire: 'Sentirse amado/a y apreciado/a',
    strengths: ['Empatía profunda', 'Generosidad sincera', 'Conexión humana', 'Apoyo incondicional'],
    challenges: ['Descuido propio', 'Necesidad de aprobación', 'Orgullo encubierto', 'Dependencia emocional'],
    stress: { type: 8, name: 'Hacia el Desafiador' },
    growth: { type: 4, name: 'Hacia el Individualista' },
    wings: ['2w1 — El Asistente (más principioso, correcto)', '2w3 — El Anfitrión (más ambicioso, orientado a imagen)'],
  },
  {
    id: 3, emoji: '🏆', title: 'El Triunfador', center: 'Emocional',
    coreFear: 'No tener valor, ser insignificante',
    coreDesire: 'Sentirse valioso/a y digno/a',
    strengths: ['Determinación', 'Capacidad de inspirar', 'Adaptabilidad', 'Excelencia'],
    challenges: ['Identificación con la imagen', 'Temor al fracaso', 'Competitividad', 'Desconexión emocional'],
    stress: { type: 9, name: 'Hacia el Pacificador' },
    growth: { type: 6, name: 'Hacia el Leal' },
    wings: ['3w2 — El Vendedor (más carismático, orientado a personas)', '3w4 — El Profesional (más creativo, introspectivo)'],
  },
  {
    id: 4, emoji: '🎨', title: 'El Individualista', center: 'Emocional',
    coreFear: 'No tener identidad personal o significado',
    coreDesire: 'Encontrar su identidad e importancia',
    strengths: ['Creatividad profunda', 'Compasión', 'Honestidad emocional', 'Originalidad'],
    challenges: ['Melancolía', 'Autoabsorción', 'Envidia', 'Inestabilidad emocional'],
    stress: { type: 2, name: 'Hacia el Ayudador' },
    growth: { type: 1, name: 'Hacia el Reformador' },
    wings: ['4w3 — El Artista (más orientado a logros, adaptable)', '4w5 — El Bohemio (más introspectivo, analítico)'],
  },
  {
    id: 5, emoji: '🔍', title: 'El Investigador', center: 'Mental',
    coreFear: 'Ser inútil, incompetente o incapaz',
    coreDesire: 'Ser capaz y competente',
    strengths: ['Pensamiento visionario', 'Mente abierta', 'Independencia', 'Profundidad analítica'],
    challenges: ['Aislamiento', 'Retención', 'Desapego', 'Evitación emocional'],
    stress: { type: 7, name: 'Hacia el Entusiasta' },
    growth: { type: 8, name: 'Hacia el Desafiador' },
    wings: ['5w4 — El Iconoclasta (más creativo, individualista)', '5w6 — El Problema (más leal, orientado a seguridad)'],
  },
  {
    id: 6, emoji: '🛡️', title: 'El Leal', center: 'Mental',
    coreFear: 'No tener guía, apoyo o capacidad de sobrevivir',
    coreDesire: 'Tener seguridad y apoyo',
    strengths: ['Lealtad inquebrantable', 'Responsabilidad', 'Coraje real', 'Confianza'],
    challenges: ['Ansiedad', 'Desconfianza', 'Duda', 'Rebeldía'],
    stress: { type: 3, name: 'Hacia el Triunfador' },
    growth: { type: 9, name: 'Hacia el Pacificador' },
    wings: ['6w5 — El Defensor (más analítico, privado)', '6w7 — El Bufón (más sociable, optimista)'],
  },
  {
    id: 7, emoji: '⚡', title: 'El Entusiasta', center: 'Mental',
    coreFear: 'Estar en dolor o privación',
    coreDesire: 'Ser feliz y satisfecho',
    strengths: ['Optimismo contagioso', 'Versatilidad', 'Creatividad', 'Energía'],
    challenges: ['Dispersión', 'Evitación del dolor', 'Superficialidad', 'Impulsividad'],
    stress: { type: 1, name: 'Hacia el Reformador' },
    growth: { type: 5, name: 'Hacia el Investigador' },
    wings: ['7w6 — El Buddy (más leal, orientado a seguridad)', '7w8 — El Realizador (más asertivo, directo)'],
  },
  {
    id: 8, emoji: '💪', title: 'El Desafiador', center: 'Instintivo',
    coreFear: 'Ser controlado, herido o violado por otros',
    coreDesire: 'Protegerse a sí mismo y a otros',
    strengths: ['Liderazgo natural', 'Determinación', 'Protección', 'Directo y honesto'],
    challenges: ['Dominación', 'Confrontación', 'Intimidación', 'Vulnerabilidad'],
    stress: { type: 5, name: 'Hacia el Investigador' },
    growth: { type: 2, name: 'Hacia el Ayudador' },
    wings: ['8w7 — El Pacificador (más sociable, espontáneo)', '8w9 — El Desafiador (más tranquilo, pacífico)'],
  },
  {
    id: 9, emoji: '☮️', title: 'El Pacificador', center: 'Instintivo',
    coreFear: 'Pérdida y separación, desintegración',
    coreDesire: 'Paz interior y totalidad',
    strengths: ['Armonía', 'Estabilidad', 'Empatía', 'Mediación'],
    challenges: ['Complacencia', 'Evitación del conflicto', 'Pasividad', 'Indecisión'],
    stress: { type: 6, name: 'Hacia el Leal' },
    growth: { type: 3, name: 'Hacia el Triunfador' },
    wings: ['9w8 — El Refugiado (más asertivo, directo)', '9w4 — El Soñador (más creativo, introspectivo)'],
  },
]

export type EneagramaTestData = {
  nombre: string
  email: string
  telefono: string
  scores: Record<number, number>
  tipoPredominante: number
  ala: number | null
  centro: string
  timestamp: string
}

// ─── Inline style helpers ───
const table = (attrs = '') => `<table ${attrs} style="width:100%;border-collapse:collapse">`
const td = (content: string, style = '') =>
  `<td style="padding:0;${style}">${content}</td>`
const tr = (cells: string) => `<tr>${cells}</tr>`

function detailRow(label: string, value: string, color?: string): string {
  return tr(
    td(`<span style="font-size:13px;color:${MUTED}">${label}</span>`, `padding:10px 0;border-bottom:1px solid ${BORDER};width:36%`) +
    td(
      `<span style="font-size:14px;font-weight:600;color:${color || INK}">${value}</span>`,
      `padding:10px 0;border-bottom:1px solid ${BORDER};width:64%`
    )
  )
}

// ─── Main template ───
export function eneagramaReportTemplate(data: EneagramaTestData): string {
  const topType = TYPES_FULL.find(t => t.id === data.tipoPredominante) || TYPES_FULL[0]
  const wingLabel = data.ala
    ? `${data.tipoPredominante}w${data.ala} — ${WING_NAMES[`${data.tipoPredominante}w${data.ala}`] || ''}`
    : 'No detectada (diferencia < 2 puntos con adyacentes)'

  // Build sorted scores
  const totalAnswered = Object.values(data.scores).reduce((a, b) => a + b, 0)
  const sortedScores = Object.entries(data.scores)
    .map(([id, score]) => ({ id: Number(id), score }))
    .sort((a, b) => b.score - a.score)

  // Score bars HTML
  const scoreRows = sortedScores.map(({ id, score }) => {
    const t = TYPES_FULL.find(x => x.id === id)
    if (!t) return ''
    const pct = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0
    const isTop = id === data.tipoPredominante
    return tr(
      td(`<span style="font-size:14px">${t.emoji}</span>`, 'padding:6px 8px 6px 0;width:36px') +
      td(`<span style="font-size:13px;font-weight:${isTop ? '700' : '400'};color:${isTop ? BRAND : INK_SOFT}">Tipo ${id}: ${t.title}</span>`, `padding:6px 0;width:200px`) +
      td(`<div style="background:${BORDER};border-radius:3px;height:8px;width:100%"><div style="background:${isTop ? BRAND : '#c4c4c4'};height:8px;border-radius:3px;width:${pct}%"></div></div>`, 'padding:6px 8px;width:180px') +
      td(`<span style="font-size:12px;color:${MUTED};font-weight:600">${score} (${pct}%)</span>`, 'padding:6px 0;text-align:right;width:80px')
    )
  }).join('')

  // Stress / Growth
  const stressType = TYPES_FULL.find(t => t.id === topType.stress.type)
  const growthType = TYPES_FULL.find(t => t.id === topType.growth.type)

  // Wings info
  const wingsHtml = topType.wings.map((w, i) =>
    `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
      <div style="width:20px;height:20px;border-radius:50%;background:${BRAND}10;display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <span style="font-size:10px;font-weight:700;color:${BRAND}">${i + 1}</span>
      </div>
      <span style="font-size:13px;color:${MUTED}">${w}</span>
    </div>`
  ).join('')

  const content = `
    <!-- ═══ Success header ═══ -->
    <div style="text-align:center;padding:24px 0 20px">
      <div style="width:56px;height:56px;border-radius:50%;background:${BRAND}10;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px">
        <span style="font-size:28px">${topType.emoji}</span>
      </div>
      <h1 style="font-family:'Plus Jakarta Sans','Helvetica Neue',Arial,sans-serif;font-size:22px;font-weight:700;letter-spacing:-0.02em;color:${INK};margin:0 0 4px">
        Nuevo test de Eneagrama
      </h1>
      <p style="font-size:15px;color:${MUTED};margin:0">
        ${data.nombre} completó el RHETI
      </p>
    </div>

    <!-- ═══ Patient info ═══ -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
      ${detailRow('Nombre', data.nombre)}
      ${detailRow('Email', data.email)}
      ${detailRow('Teléfono', data.telefono || 'No proporcionado')}
      ${detailRow('Fecha', new Date(data.timestamp).toLocaleString('es-CL', { dateStyle: 'full', timeStyle: 'short' }))}
    </table>

    <!-- ═══ Primary type ═══ -->
    <div style="background:${BRAND}08;border-radius:12px;padding:20px 24px;margin-bottom:24px;border:1px solid ${BRAND}15">
      <table style="width:100%">
        <tr>
          <td style="padding:0;width:48px;vertical-align:middle">
            <span style="font-size:32px">${topType.emoji}</span>
          </td>
          <td style="padding:0 0 0 16px;vertical-align:middle">
            <span style="font-family:'Plus Jakarta Sans','Helvetica Neue',Arial,sans-serif;font-size:17px;font-weight:700;color:${INK}">
              Tipo ${data.tipoPredominante}: ${topType.title}
            </span>
            <span style="display:block;font-size:13px;color:${BRAND};margin-top:2px">
              Centro ${topType.center} · Ala: ${wingLabel}
            </span>
          </td>
        </tr>
      </table>
    </div>

    <!-- ═══ Complete scores ═══ -->
    <div style="margin-bottom:24px">
      <h3 style="font-family:'Plus Jakarta Sans','Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:700;color:${INK};margin:0 0 12px">
        Distribución completa de scores (${totalAnswered} respuestas)
      </h3>
      <table style="width:100%;border-collapse:collapse">
        ${scoreRows}
      </table>
    </div>

    <!-- ═══ Core analysis ═══ -->
    <div style="margin-bottom:24px">
      <h3 style="font-family:'Plus Jakarta Sans','Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:700;color:${INK};margin:0 0 12px">
        Análisis del Tipo ${data.tipoPredominante}
      </h3>

      <!-- Fear & Desire -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
        <div style="background:#fef2f2;border-radius:10px;padding:16px;border:1px solid rgba(239,68,68,0.1)">
          <span style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#dc2626;display:block;margin-bottom:6px">Miedo Central</span>
          <span style="font-size:13px;color:${MUTED};line-height:1.5">${topType.coreFear}</span>
        </div>
        <div style="background:#f0fdf4;border-radius:10px;padding:16px;border:1px solid rgba(34,197,94,0.1)">
          <span style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#16a34a;display:block;margin-bottom:6px">Deseo Central</span>
          <span style="font-size:13px;color:${MUTED};line-height:1.5">${topType.coreDesire}</span>
        </div>
      </div>

      <!-- Strengths & Challenges -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
        <div style="background:#f0f7ff;border-radius:10px;padding:16px;border:1px solid rgba(37,99,235,0.1)">
          <span style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND};display:block;margin-bottom:8px">Fortalezas</span>
          ${topType.strengths.map(s => `<div style="font-size:13px;color:${MUTED};margin-bottom:4px">✦ ${s}</div>`).join('')}
        </div>
        <div style="background:#fff7ed;border-radius:10px;padding:16px;border:1px solid rgba(234,88,12,0.1)">
          <span style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#ea580c;display:block;margin-bottom:8px">Desafíos</span>
          ${topType.challenges.map(c => `<div style="font-size:13px;color:${MUTED};margin-bottom:4px">✦ ${c}</div>`).join('')}
        </div>
      </div>

      <!-- Stress & Growth -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
        <div style="background:#fdf4f0;border-radius:10px;padding:16px;border:1px solid ${BORDER}">
          <span style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#dc2626;display:block;margin-bottom:6px">Estrés → Tipo ${topType.stress.type}</span>
          <span style="font-size:13px;color:${MUTED};line-height:1.5">${stressType?.emoji} ${topType.stress.name}</span>
        </div>
        <div style="background:#edf5f2;border-radius:10px;padding:16px;border:1px solid ${BORDER}">
          <span style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#16a34a;display:block;margin-bottom:6px">Crecimiento → Tipo ${topType.growth.type}</span>
          <span style="font-size:13px;color:${MUTED};line-height:1.5">${growthType?.emoji} ${topType.growth.name}</span>
        </div>
      </div>
    </div>

    <!-- ═══ Wings ═══ -->
    <div style="background:${SURFACE};border-radius:12px;padding:20px 24px;margin-bottom:24px;border:1px solid ${BORDER}">
      <h3 style="font-family:'Plus Jakarta Sans','Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:700;color:${INK};margin:0 0 12px">
        Alas posibles
      </h3>
      ${wingsHtml}
    </div>

    <!-- ═══ Note ═══ -->
    <div style="background:${SURFACE};border-radius:10px;padding:16px 18px;margin-bottom:24px;font-size:13px;color:${MUTED};line-height:1.6">
      <strong style="color:${INK_SOFT}">📌 Nota clínica:</strong><br />
      Este test es orientativo. El análisis completo del perfil eneagramático se realiza en sesión. Los scores reflejan tendencias, no diagnósticos.
    </div>
  `

  // Build full HTML
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>Test Eneagrama — ${data.nombre}</title>
</head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Source Sans 3','Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:1.6;color:${INK};-webkit-font-smoothing:antialiased">
  <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">
    Test de Eneagrama de ${data.nombre} — Tipo ${data.tipoPredominante}
  </div>

  ${table()}
    ${tr(td(`
      <div style="max-width:560px;margin:32px auto">
        ${table('border="0" cellpadding="0" cellspacing="0"')}
          ${tr(td(`
            <!-- ═══ Header ═══ -->
            <div style="background:${BG};border-radius:16px 16px 0 0;overflow:hidden">
              <div style="height:4px;background:linear-gradient(90deg,${BRAND},${BRAND_DARK})"></div>
              <div style="padding:32px 36px 0">
                <table style="width:100%">
                  <tr>
                    <td style="padding:0;vertical-align:middle">
                      <span style="font-family:'Plus Jakarta Sans','Helvetica Neue',Arial,sans-serif;font-size:22px;font-weight:800;letter-spacing:-0.03em;color:${INK}">
                        Psicobahamondes
                      </span>
                    </td>
                    <td style="padding:0;text-align:right;vertical-align:middle">
                      <span style="font-size:11px;color:${MUTED}">Reporte de Eneagrama</span>
                    </td>
                  </tr>
                </table>
                <div style="height:1px;background:${BORDER};margin:20px 0 0"></div>
              </div>
            </div>
          `))}
        </table>

        <!-- ═══ Content ═══ -->
        <div style="background:${BG};padding:0 36px 32px">
          ${content}
        </div>

        <!-- ═══ Footer ═══ -->
        <div style="background:${BG};border-radius:0 0 16px 16px;padding:0 36px 28px">
          <div style="height:1px;background:${BORDER};margin-bottom:20px"></div>
          <table style="width:100%">
            <tr>
              <td style="padding:0;font-size:13px;color:${MUTED};line-height:1.7">
                <strong style="color:${INK_SOFT};font-family:'Plus Jakarta Sans','Helvetica Neue',Arial,sans-serif">Psicobahamondes</strong><br />
                Pedro Bahamondes · Psicólogo Clínico<br />
                <a href="https://psicobahamondes.cl" style="color:${BRAND};text-decoration:none">psicobahamondes.cl</a>
              </td>
              <td style="padding:0;text-align:right;font-size:13px;color:${MUTED};line-height:1.7">
                Edificio Plaza Bühler, 6to piso<br />Av. Guillermo Bühler 2005, Santiago<br />
                <a href="mailto:contacto@psicobahamondes.cl" style="color:${BRAND};text-decoration:none">contacto@psicobahamondes.cl</a>
              </td>
            </tr>
          </table>
          <div style="margin-top:16px;font-size:11px;color:${MUTED_LIGHT};text-align:center">
            Este es un reporte automático del test de Eneagrama. Datos del paciente: ${data.email}
          </div>
        </div>
      </div>
    `))}
  </table>
</body>
</html>`
}
