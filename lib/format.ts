/** Formatea una fecha ISO de Notion (YYYY-MM-DD) en español legible. */
export function formatDate(iso: string): string {
  if (!iso) return ''
  const value = iso.length <= 10 ? `${iso}T12:00:00` : iso
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Formato corto: "mar 2026". */
export function formatMonthYear(iso: string): string {
  if (!iso) return ''
  const value = iso.length <= 10 ? `${iso}T12:00:00` : iso
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('es-CL', { month: 'short', year: 'numeric' })
}
