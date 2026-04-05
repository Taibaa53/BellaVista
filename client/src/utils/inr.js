/** Format amount as Indian Rupees (en-IN grouping). */
export function formatInr(amount) {
  const n = Number(amount);
  if (Number.isNaN(n)) return "₹—";
  return `₹${n.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })}`;
}
