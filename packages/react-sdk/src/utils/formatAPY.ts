/**
 * Formats an APY to a percentage with a specified number of decimal places
 * @param apy  The APY to format
 * @param decimals  The number of decimal places to round to
 * @returns  The formatted APY
 */
export const formatAPY = (apy?: number | string, decimals = 2) =>
  `${(Number(apy ?? 0) * 100).toFixed(decimals)}%`;
