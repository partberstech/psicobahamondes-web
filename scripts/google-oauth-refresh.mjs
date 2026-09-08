#!/usr/bin/env node
/**
 * Google OAuth — Obtener un GOOGLE_REFRESH_TOKEN nuevo para el sistema de agendamiento.
 *
 * El refresh token guardado en .env.local expiró (invalid_grant). Este script:
 *   1. Levanta un servidor local en http://localhost:8787
 *   2. Abre en tu navegador la pantalla de autorización de Google
 *   3. Autorizas con la cuenta DUEÑA del calendario (psicobahamondes@gmail.com)
 *   4. Google redirige a localhost con el código → el script lo canjea por tokens
 *   5. Verifica la cuenta autorizada y lista los calendarios accesibles
 *   6. Actualiza GOOGLE_REFRESH_TOKEN en .env.local
 *
 * Requisito previo en Google Cloud Console (solo si el cliente es tipo "Web app"):
 *   Credenciales → OAuth 2.0 Client IDs → tu cliente (538090596581-…) →
 *   "URIs de redireccionamiento autorizadas" → agregar:  http://localhost:8787  → Guardar
 *   (Los clientes tipo "App de escritorio" no necesitan registrar la URI.)
 *
 * Uso:  node scripts/google-oauth-refresh.mjs
 *       PORT=9000 node scripts/google-oauth-refresh.mjs   (puerto alternativo)
 */
import http from 'node:http'
import { readFileSync, writeFileSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { google } from 'googleapis'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const ENV_PATH = join(ROOT, '.env.local')
const PORT = Number(process.env.PORT || 8787)
const REDIRECT_URI = `http://localhost:${PORT}`

// ── Scope mínimo: calendario (correos van por Resend, no por Gmail API) ──
// openid + userinfo.email solo para verificar QUÉ cuenta autorizó.
const SCOPES = [
  'openid',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/calendar',
]

// ── Cargar .env.local (parser simple; respeta comillas y comentarios) ──
function loadEnv(file) {
  const env = {}
  for (const raw of readFileSync(file, 'utf8').split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq < 1) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    env[key] = value
  }
  return env
}

function decodeIdToken(token) {
  try {
    const payload = token.split('.')[1]
    const json = Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
    return JSON.parse(json)
  } catch {
    return null
  }
}

const env = loadEnv(ENV_PATH)
const clientId = env.GOOGLE_CLIENT_ID
const clientSecret = env.GOOGLE_CLIENT_SECRET

if (!clientId || !clientSecret) {
  console.error('❌ No encuentro GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET en .env.local')
  process.exit(1)
}

const oauth = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI)

// ── Servidor local que recibe el callback de Google ──
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')

  const html = (title, body) =>
    `<!doctype html><meta charset="utf-8"><title>${title}</title>` +
    `<body style="font-family:system-ui;max-width:640px;margin:60px auto;line-height:1.6">${body}</body>`

  if (error) {
    console.error(`❌ Google respondió con error: ${error}`)
    res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(html('Error', `<h1>Autorización rechazada</h1><p>${error}</p><p>Revisa la consola y reintenta.</p>`))
    server.close()
    return
  }
  if (!code) {
    res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(html('Sin código', '<h1>No se recibió código de autorización</h1><p>Vuelve a abrir la URL completa.</p>'))
    return
  }

  try {
    const { tokens } = await oauth.getToken(code)
    const refreshToken = tokens.refresh_token

    // ── Verificar QUÉ cuenta autorizó (evita token en cuenta equivocada) ──
    const idClaims = tokens.id_token ? decodeIdToken(tokens.id_token) : null
    const authorizedEmail = idClaims?.email || 'desconocida'
    console.log('')
    console.log('✅ Autorización completada')
    console.log('   Cuenta que autorizó :', authorizedEmail)
    console.log('   ¿Tienes refresh token?', refreshToken ? 'SÍ' : 'NO')

    if (!refreshToken) {
      console.error('   ⚠️ No se devolvió refresh_token (normal si la app ya fue autorizada antes con "consent" guardado).')
      console.error('      Cierra sesión del flujo previo o revoca el acceso en https://myaccount.google.com/permissions y reintenta.')
      res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(html('Sin refresh token', '<h1>No se obtuvo refresh_token</h1><p>Revoca el acceso previo en <a href="https://myaccount.google.com/permissions">myaccount.google.com/permissions</a> para la app y vuelve a intentar.</p>'))
      server.close()
      return
    }

    // ── Actualizar .env.local ──
    const original = readFileSync(ENV_PATH, 'utf8')
    const lineRe = /^GOOGLE_REFRESH_TOKEN=.*$/m
    const updated = lineRe.test(original)
      ? original.replace(lineRe, `GOOGLE_REFRESH_TOKEN=${refreshToken}`)
      : original.replace(/\n*$/, '') + `\nGOOGLE_REFRESH_TOKEN=${refreshToken}\n`
    writeFileSync(ENV_PATH, updated)
    console.log('   ✍️  GOOGLE_REFRESH_TOKEN actualizado en .env.local')

    // ── Verificación real: listar calendarios accesibles ──
    oauth.setCredentials({ refresh_token: refreshToken })
    try {
      const cal = google.calendar({ version: 'v3', auth: oauth })
      const list = await cal.calendarList.list({ maxResults: 25 })
      const cals = list.data.items || []
      console.log('')
      console.log(`📅 Calendarios accesibles (${cals.length}):`)
      for (const c of cals) {
        console.log(`   - ${c.summary}${c.primary ? ' [principal]' : ''} | id: ${c.id}`)
      }
      const summary = `✅ Token guardado.<p><b>Cuenta autorizada:</b> ${authorizedEmail}</p><p>Ya puedes cerrar esta pestaña y volver a la sesión.</p>`
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(html('Token guardado', summary))
    } catch (calErr) {
      console.error('   ⚠️ No se pudo listar calendarios:', calErr?.response?.data?.error?.message || calErr.message)
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(html('Token guardado', '<h1>Token guardado</h1><p>Pero falló listar calendarios — revisa la consola del script.</p>'))
    }
    server.close()
  } catch (err) {
    console.error('❌ Error canjeando el código:', err?.response?.data?.error_description || err?.response?.data?.error || err.message)
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(html('Error', `<h1>Error</h1><pre>${err?.response?.data?.error_description || err.message}</pre>`))
    server.close()
  }
})

server.listen(PORT, '127.0.0.1', () => {
  const authUrl = oauth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
    login_hint: 'psicobahamondes@gmail.com',
  })
  console.log('='.repeat(72))
  console.log('  1. Abre esta URL en tu navegador (sesión iniciada como psicobahamondes@gmail.com):')
  console.log('')
  console.log('     ' + authUrl)
  console.log('')
  console.log('  2. Si te pide elegir cuenta, selecciona psicobahamondes@gmail.com')
  console.log('  3. Acepta los permisos de Google Calendar y espera…')
  console.log('='.repeat(72))
  console.log('')

  // Intentar abrir el navegador automáticamente (solo macOS/Linux; falla silencioso)
  const opener = process.platform === 'darwin' ? 'open' : process.platform === 'linux' ? 'xdg-open' : null
  if (opener) {
    spawn(opener, [authUrl], { stdio: 'ignore' }).on('error', () => {})
  }
})
