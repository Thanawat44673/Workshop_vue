export function formatPrice(value) {
  if (value === null || value === undefined || value === '') return '—'

  const amount = Number(value)
  return Number.isFinite(amount)
    ? new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount)
    : String(value)
}
