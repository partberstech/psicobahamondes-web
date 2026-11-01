#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Push a GitHub y (opcional) deploy a producción en Vercel.
#
# Credenciales: archivo .secrets.local en la raíz del proyecto (ignorado por git).
#
#   GITHUB_TOKEN=github_pat_xxx   # obligatorio para hacer push
#   VERCEL_TOKEN=xxx              # opcional; si falta, Vercel despliega solo
#                                 # al recibir el push (deploy automático)
#   VERCEL_SCOPE=team_xxx         # opcional, si el token es de un equipo
#
# Uso:
#   ./scripts/deploy.sh              # push a main
#   ./scripts/deploy.sh otra-rama
#   SECRETS_FILE=/ruta/archivo ./scripts/deploy.sh
#
# Ver scripts/README.md → sección "Despliegue".
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

cd "$(dirname "$0")/.."

BRANCH="${1:-main}"
SECRETS="${SECRETS_FILE:-.secrets.local}"

# `.` busca en PATH si el nombre no lleva barra: forzamos ruta relativa.
if [[ "$SECRETS" != /* ]]; then
  SECRETS="./$SECRETS"
fi

if [[ -f "$SECRETS" ]]; then
  set -a
  # shellcheck disable=SC1090
  . "$SECRETS"
  set +a
fi

if [[ -z "${GITHUB_TOKEN:-}" ]]; then
  cat >&2 <<'MSG'
ERROR: falta GITHUB_TOKEN.

Crea el archivo .secrets.local en la raíz del proyecto con:

    GITHUB_TOKEN=github_pat_xxxxxxxx

Pasos para generar el token: scripts/README.md → "Despliegue".
MSG
  exit 1
fi

echo "→ Push a origin/$BRANCH ..."
# El token se pasa por entorno a un credential helper efímero: no queda en
# el historial de git, ni en .git/config, ni en la URL del remoto.
git \
  -c credential.helper='!f() { echo username=x-access-token; echo "password=$GITHUB_TOKEN"; }; f' \
  push origin "$BRANCH"

if [[ -n "${VERCEL_TOKEN:-}" ]]; then
  echo "→ Deploy a producción en Vercel ..."
  ARGS=(deploy --prod --yes --token "$VERCEL_TOKEN")
  if [[ -n "${VERCEL_SCOPE:-}" ]]; then
    ARGS+=(--scope "$VERCEL_SCOPE")
  fi
  npx --yes vercel "${ARGS[@]}"
else
  echo "→ Sin VERCEL_TOKEN: Vercel desplegará automáticamente el push a '$BRANCH'."
fi

echo "→ Listo."
