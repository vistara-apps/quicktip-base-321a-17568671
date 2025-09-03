/**
 * Transaction service for handling tip transactions
 */

import { TipTransactionModel } from '../models/tipTransaction';
import { v4 as uuidv4 } from 'uuid';
import { calculateFeeAmount } from '../utils/feeCalculator';

/**
 * Create a new tip transaction
 * @param {Object} transactionData - Transaction data
 * @returns {Promise<Object>} Created transaction
 */
export const createTransaction = async (transactionData) => {
  const {
    senderAddress,
    receiverAddress,
    amountUSD,
    amountUSDC,
    status = 'pending',
    transactionHash = null,
    senderUserId = null,
    receiverUserId = null,
  } = transactionData;

  // Calculate fee (1% as per business model)
  const feeAmount = calculateFeeAmount(parseFloat(amountUSD));

  // Create transaction record
  return await TipTransactionModel.create({
    transactionId: transactionData.transactionId || uuidv4(),
    senderAddress,
    receiverAddress,
    amountUSD: parseFloat(amountUSD),
    amountUSDC,
    status,
    transactionHash,
    feeAmount,
    senderUserId,
    receiverUserId,
  });
};

/**
 * Update transaction status
 * @param {string} transactionId - Transaction ID
 * @param {string} status - New status (pending, success, failed)
 * @param {string} transactionHash - Transaction hash (optional)
 * @returns {Promise<Object>} Updated transaction
 */
export const updateTransactionStatus = async (
  transactionId,
  status,
  transactionHash = null
) => {
  return await TipTransactionModel.updateStatus(
    transactionId,
    status,
    transactionHash
  );
};

/**
 * Get user's transaction history
 * @param {string} address - User's wallet address
 * @returns {Promise<Object>} Object containing sent and received transactions
 */
export const getUserTransactionHistory = async (address) => {
  if (!address) return { sent: [], received: [] };

  try {
    const sentTransactions = await TipTransactionModel.getBySender(address);
    const receivedTransactions = await TipTransactionModel.getByReceiver(address);

    return {
      sent: sentTransactions,
      received: receivedTransactions,
    };
  } catch (error) {
    console.error('Error getting user transaction history:', error);
    return { sent: [], received: [] };
  }
};

/**
 * Get transaction by ID
 * @param {string} transactionId - Transaction ID
 * @returns {Promise<Object|null>} Transaction or null if not found
 */
export const getTransactionById = async (transactionId) => {
  return await TipTransactionModel.getById(transactionId);
};

/**
 * Get transaction by hash
 * @param {string} transactionHash - Transaction hash
 * @returns {Promise<Object|null>} Transaction or null if not found
 */
export const getTransactionByHash = async (transactionHash) => {
  return await TipTransactionModel.getByHash(transactionHash);
};

export default {
  createTransaction,
  updateTransactionStatus,
  getUserTransactionHistory,
  getTransactionById,
  getTransactionByHash,
};

