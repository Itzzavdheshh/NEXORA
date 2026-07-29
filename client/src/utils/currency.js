/**
 * Currency utility helpers for NEXORA dual-currency formatting ($ USD & ₹ INR)
 * Exchange rate: 1 USD = 95.69 INR
 */

export const USD_TO_INR_RATE = 95.69;

export function formatHourlyRate(rateUSD, options = {}) {
  const num = Number(rateUSD);
  if (isNaN(num) || num <= 0) {
    return options.freeLabel || "Free";
  }

  const rateINR = Math.round(num * USD_TO_INR_RATE);
  const formattedINR = rateINR.toLocaleString("en-IN");

  if (options.compact) {
    return `$${num} (₹${formattedINR})`;
  }

  if (options.inrFirst) {
    return `₹${formattedINR} ($${num})/hr`;
  }

  return `$${num} (₹${formattedINR})/hr`;
}

export function getInrEquivalent(rateUSD) {
  const num = Number(rateUSD);
  if (isNaN(num) || num <= 0) return 0;
  return Math.round(num * USD_TO_INR_RATE);
}
