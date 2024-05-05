import BigNumber from "bignumber.js";

/**
 * Formats a balance to a string with the specified number of decimal places and currency (using the it-IT locale)
 * @param balance  The balance to format
 * @param currency  The currency to format the balance in
 * @param decimals  The number of decimal places to round to
 * @returns  The formatted balance
 */
export const formatBalance = (
  balance?: number | string,
  currency?: string,
  decimals = 2
) => {
  const bn = BigNumber(balance ?? 0);
  if (bn.isNaN()) return "NaN";
  if (bn.isZero()) return "0";
  if (bn.lt(0.01)) return `< 0.01`;

  const fixedDecimals = `${Number(balance ?? 0).toFixed(decimals)}`;

  if (currency)
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: currency,
    }).format(Number(fixedDecimals));

  return fixedDecimals;
};
