# Scripts de utilidad — Psicobahamondes

## `google-oauth-refresh.mjs`

Regenera el `GOOGLE_REFRESH_TOKEN` del sistema de agendamiento (Google Calendar).

**Cuándo usarlo:** cuando el calendario deja de bloquear horarios o las reservas
online fallan, y en los logs aparece `invalid_grant`. Pasa porque el refresh
token caducó (los tokens de apps OAuth en estado **Testing** expiran a los ~7 días).

**Uso:**
```bash
node scripts/google-oauth-refresh.mjs
```
1. El script levanta un servidor en `http://localhost:8787` y abre el navegador.
2. Autoriza con **psicobahamondes@gmail.com** (la dueña del calendario).
3. Si el cliente OAuth es tipo "Web app", agrega antes la URI de redirección
   `http://localhost:8787` en Google Cloud Console → Credenciales → OAuth Client.
4. El script guarda el token nuevo en `.env.local` y lista los calendarios.

**Después de regenerar el token también hay que actualizarlo en Vercel:**
```bash
# (extraer el valor nuevo de .env.local y luego:)
vercel env rm GOOGLE_REFRESH_TOKEN production -y
vercel env rm GOOGLE_REFRESH_TOKEN preview -y
printf '\n' | vercel env add GOOGLE_REFRESH_TOKEN production --value "$TOKEN" --non-interactive
printf '\n' | vercel env add GOOGLE_REFRESH_TOKEN preview --value "$TOKEN" --non-interactive
vercel --prod --yes
```

**Para que NO vuelva a caducar:** en Google Cloud Console → *APIs y servicios →
Pantalla de consentimiento OAuth*, cambia el estado de **Testing** a **In production**.
No requiere verificación si el único usuario autorizado es la propia cuenta
(`psicobahamondes@gmail.com`). Con eso el refresh token deja de expirar.

## Variables de entorno relevantes (`.env.local` y Vercel)

| Variable | Valor actual | Rol |
|---|---|---|
| `GOOGLE_CLIENT_ID` | `538090596581-…apps.googleusercontent.com` | Cliente OAuth |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-…` | Secreto OAuth |
| `GOOGLE_REFRESH_TOKEN` | (regenerado con el script) | Token de acceso a Calendar |
| `GOOGLE_CALENDAR_ID` | `eb7b7cab…@group.calendar.google.com` | Calendario "agenda psicológica" donde se crean las reservas |
| `GOOGLE_BUSY_CALENDAR_IDS` | `primary` | Calendario principal también bloquea horarios ocupados |
