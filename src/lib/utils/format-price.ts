export function formatPriceEUR(cents: number): string {
  const decimals = cents % 100 === 0 ? 0 : 2;
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(cents / 100);
}
