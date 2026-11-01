# Scripts de utilidad — Psicobahamondes

## `deploy.sh` — push a GitHub + deploy en Vercel

Hace `git push` sin pedir credenciales y, si hay token de Vercel, lanza el
deploy a producción. Las credenciales se leen de `.secrets.local`, un archivo
en la raíz del proyecto **ignorado por git**.

### Configuración (una sola vez)

**1. Crear un token de GitHub (fine-grained, mínimo privilegio)**

GitHub → *Settings* → *Developer settings* → *Personal access tokens* →
*Fine-grained tokens* → **Generate new token**:

- **Repository access**: *Only select repositories* → `partberstech/psicobahamondes-web`
- **Permissions** → *Repository permissions* → **Contents: Read and write**
- **Expiration**: 90 días (o el plazo que prefieras)

Copia el token (`github_pat_…`).

**2. Guardarlo en el proyecto**

```bash
cd "/ruta/a/01. Psicobahamondes"
printf 'GITHUB_TOKEN=%s\n' 'github_pat_xxx' > .secrets.local
chmod 600 .secrets.local
```

Verifica que git lo ignora:

```bash
git check-ignore -v .secrets.local   # debe imprimir una regla de .gitignore
```

**3. (Opcional) deploy directo con Vercel CLI**

Solo si quieres desplegar sin pasar por GitHub. Crea un token en
<https://vercel.com/account/tokens> y agrégalo:

```bash
printf 'VERCEL_TOKEN=%s\n' 'tu_token' >> .secrets.local
```

> Si no defines `VERCEL_TOKEN`, Vercel despliega automáticamente al recibir
> el push a `main` (deploy automático ya conectado al proyecto
> `psicobahamondes-web`).

### Uso

```bash
./scripts/deploy.sh            # push a main
./scripts/deploy.sh mi-rama    # push a otra rama
```

### Seguridad

- `.secrets.local` está en `.gitignore` y con permisos `600` (solo tu usuario).
- El token se inyecta por variable de entorno a un credential helper efímero:
  **no** queda en el historial de git, ni en `.git/config`, ni en la URL del remoto.
- Revoca el token cuando quieras en la misma página de GitHub; el script
  dejará de funcionar y basta con generar otro.

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

## Newsletter

Sistema en `lib/newsletter.ts`. Lee los artículos publicados de los últimos
**7 días** desde la base *Blog Psicobahamondes* y los envía a los suscriptores
con estado distinto de `Inactivo`.

**Envío privado:** cada correo se manda a UN destinatario (API batch de Resend),
así nadie ve las direcciones de los demás.

### Variables de entorno

| Variable | Obligatoria | Rol |
|---|---|---|
| `RESEND_API_KEY` | sí | Envío de correos |
| `CRON_SECRET` | sí en Vercel | Autentica el cron y los envíos manuales |
| `NEWSLETTER_FROM` | no | Remitente. Si falta se usa `EMAIL_FROM` (ya verificado en Resend) |
| `ADMIN_EMAIL` | no | Se usa como `reply-to` |

> **Importante:** Vercel Cron solo envía la cabecera
> `Authorization: Bearer <CRON_SECRET>` si esa variable existe en el proyecto.
> Sin ella, el cron recibe `401` y no envía nada.

### Endpoints

| Método | Ruta | Uso |
|---|---|---|
| `GET` | `/api/newsletter/send` | Cron semanal (protegido por `CRON_SECRET`) |
| `POST` | `/api/newsletter/send` | Envío manual (mismo secreto) |
| `GET` | `/api/newsletter/unsubscribe?token=…` | Baja firmada desde el correo |

Parámetros del envío:

- `?preview=1` → devuelve el HTML del correo (para revisar el diseño).
- `?dryRun=1` → no envía, informa cuántos artículos y suscriptores hay.
- `?to=correo@dominio` → envía una **prueba** a una sola dirección.
- `?days=7` → ventana de artículos (1–90).

### Uso manual

```bash
# desde .env.local
set -a; . ./.env.local; set +a

# revisar el diseño en el navegador
open "http://localhost:3000/api/newsletter/send?preview=1&token=$CRON_SECRET"

# simular sin enviar
curl "http://localhost:3000/api/newsletter/send?dryRun=1&token=$CRON_SECRET"

# enviar prueba real a una sola dirección
curl "http://localhost:3000/api/newsletter/send?to=tu@correo.cl&token=$CRON_SECRET"

# envío real a toda la lista
curl "https://www.psicobahamondes.cl/api/newsletter/send?token=$CRON_SECRET"
```

### Programación

`vercel.json` → `0 13 * * 1` = **lunes 10:00 en Chile** (UTC−3). Vercel evalúa
los cron en UTC, así que en invierno (UTC−4) se enviará a las 09:00 locales.

### Baja

El enlace del pie lleva un token firmado con HMAC-SHA256 y al abrirlo se marca
al suscriptor como `Inactivo` en Notion. No expone el correo en la URL.

La clave de firma es `NEWSLETTER_SECRET` si existe; si no, `NOTION_API_KEY`
(estable en todos los entornos). **No** se usa `CRON_SECRET` para firmar, para
que rotar ese secreto no invalide los enlaces que ya están en las bandejas.
Si quieres una clave dedicada, define `NEWSLETTER_SECRET` **antes** del primer
envío real: cambiarla después invalida los enlaces anteriores.

