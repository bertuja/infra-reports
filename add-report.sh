#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# add-report.sh — Agrega un reporte HTML al portal y hace deploy en Vercel
#
# Uso:
#   ./add-report.sh <archivo.html> "<Título>" "<Cliente>" <tipo> [descripción]
#
# Tipos: ejecutivo | devs | infra | hotsale | otro
#
# Ejemplo:
#   ./add-report.sh ~/devops/reporte_ejecutivo_presis.html \
#     "Estado Infraestructura Abril" "Presis Postal" ejecutivo \
#     "Curva de uso de recursos, ALB y RDS — últimos 30 días"
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
REPORTS_DIR="$REPO_DIR/public/reports"
MANIFEST="$REPORTS_DIR/manifest.json"

# ── Validación de argumentos ──────────────────────────────────────────────────
if [[ $# -lt 4 ]]; then
  echo "❌  Uso: $0 <archivo.html> \"<Título>\" \"<Cliente>\" <tipo> [descripción]"
  echo "    Tipos válidos: ejecutivo | devs | infra | hotsale | otro"
  exit 1
fi

INPUT_FILE="$1"
TITLE="$2"
CLIENT="$3"
TYPE="$4"
DESCRIPTION="${5:-}"

VALID_TYPES="ejecutivo devs infra hotsale otro"
if ! echo "$VALID_TYPES" | grep -qw "$TYPE"; then
  echo "❌  Tipo inválido: '$TYPE'. Válidos: $VALID_TYPES"
  exit 1
fi

if [[ ! -f "$INPUT_FILE" ]]; then
  echo "❌  Archivo no encontrado: $INPUT_FILE"
  exit 1
fi

# ── Generar ID y nombre de archivo ───────────────────────────────────────────
DATE=$(date +%Y-%m-%d)
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//;s/-$//')
ID="${DATE}-${SLUG}"
FILENAME="${ID}.html"
DEST="$REPORTS_DIR/$FILENAME"

# ── Copiar archivo ────────────────────────────────────────────────────────────
echo "📋  Copiando reporte..."
cp "$INPUT_FILE" "$DEST"
echo "    → $DEST"

# ── Actualizar manifest.json ──────────────────────────────────────────────────
echo "📝  Actualizando manifest.json..."

ENTRY=$(python3 -c "
import json, sys

manifest_path = '$MANIFEST'
try:
    with open(manifest_path) as f:
        data = json.load(f)
except:
    data = []

# Evitar duplicados por ID
data = [r for r in data if r.get('id') != '$ID']

data.append({
    'id': '$ID',
    'title': '''$TITLE''',
    'client': '''$CLIENT''',
    'type': '$TYPE',
    'date': '$DATE',
    'file': '$FILENAME',
    'description': '''$DESCRIPTION''',
})

with open(manifest_path, 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print('OK')
")

echo "    → $ENTRY"

# ── Git commit y push ─────────────────────────────────────────────────────────
echo "🔀  Commiteando en git..."
cd "$REPO_DIR"
git add "public/reports/$FILENAME" "public/reports/manifest.json"
git commit -m "report: $CLIENT — $TITLE ($DATE)"
git push origin main
echo "    → Push OK"

# ── URL del reporte ───────────────────────────────────────────────────────────
# Obtener URL de producción de Vercel
VERCEL_URL=$(vercel ls --scope=bertuja 2>/dev/null | grep "infra-reports" | grep "●" | head -1 | awk '{print $2}' || echo "")
if [[ -z "$VERCEL_URL" ]]; then
  VERCEL_URL="infra-reports.vercel.app"
fi

echo ""
echo "✅  Reporte subido exitosamente"
echo "────────────────────────────────────────"
echo "📊  Título:  $TITLE"
echo "🏢  Cliente: $CLIENT"
echo "🏷️   Tipo:    $TYPE"
echo "📅  Fecha:   $DATE"
echo ""
echo "🔗  Link directo al reporte:"
echo "    https://$VERCEL_URL/reports/$FILENAME"
echo ""
echo "📋  Portal completo:"
echo "    https://$VERCEL_URL"
echo "────────────────────────────────────────"
