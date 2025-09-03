/**
 * Fee calculator utility for tip transactions
 */

// Fee percentage as per business model (1%)
const FEE_PERCENTAGE = 0.01;

// Fee recipient address (platform wallet)
export const FEE_RECIPIENT_ADDRESS = process.env.FEE_RECIPIENT_ADDRESS || '0x000000000000000000000000000000000000fee1';

/**
 * Calculate fee amount based on tip amount
 * @param {number} amountUSD - Tip amount in USD
 * @returns {number} Fee amount in USD
 */
export const calculateFeeAmount = (amountUSD) => {
  return parseFloat((amountUSD * FEE_PERCENTAGE).toFixed(2));
};

/**
 * Calculate net amount after fee
 * @param {number} amountUSD - Tip amount in USD
 * @returns {number} Net amount in USD
 */
export const calculateNetAmount = (amountUSD) => {
  const feeAmount = calculateFeeAmount(amountUSD);
  return parseFloat((amountUSD - feeAmount).toFixed(2));
};

/**
 * Calculate fee amount in USDC
 * @param {string} amountUSDC - Tip amount in USDC (as string to preserve precision)
 * @returns {string} Fee amount in USDC
 */
export const calculateFeeAmountUSDC = (amountUSDC) => {
  const amount = parseFloat(amountUSDC);
  const feeAmount = amount * FEE_PERCENTAGE;
  return feeAmount.toString();
};

/**
 * Calculate net amount in USDC after fee
 * @param {string} amountUSDC - Tip amount in USDC (as string to preserve precision)
 * @returns {string} Net amount in USDC
 */
export const calculateNetAmountUSDC = (amountUSDC) => {
  const amount = parseFloat(amountUSDC);
  const feeAmount = amount * FEE_PERCENTAGE;
  const netAmount = amount - feeAmount;
  return netAmount.toString();
};

export default {
  FEE_PERCENTAGE,
  FEE_RECIPIENT_ADDRESS,
  calculateFeeAmount,
  calculateNetAmount,
  calculateFeeAmountUSDC,
  calculateNetAmountUSDC,
};

