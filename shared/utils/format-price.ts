const LOCALE = "es-AR";
const CURRENCY = "ARS";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}
