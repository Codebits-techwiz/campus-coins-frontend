/** Derive high/medium/low impact from tip.potentialSavings (display amount). */
export function getTipImpact(tip) {
  if (tip?.impact) return String(tip.impact).toLowerCase();
  const savings = Number(tip?.potentialSavings) || 0;
  if (savings >= 50) return 'high';
  if (savings >= 15) return 'medium';
  return 'low';
}
