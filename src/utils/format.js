export function formatPrice(price) {
  const n = Number(price);
  if (!Number.isFinite(n)) return "N/A";
  return `₹${n.toFixed(2)}`;
}
