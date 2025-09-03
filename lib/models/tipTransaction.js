/**
 * TipTransaction model implementation
 */

import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

/**
 * Create a new tip transaction
 * @param {Object} transactionData - Transaction data
 * @returns {Promise<Object>} Created transaction
 */
export const create = async (transactionData) => {
  const {
    transactionId = uuidv4(),
    senderAddress,
    receiverAddress,
    amountUSD,
    amountUSDC,
    status = 'pending',
    transactionHash = null,
    feeAmount = 0,
    senderUserId = null,
    receiverUserId = null,
  } = transactionData;

  return await prisma.tipTransaction.create({
    data: {
      transactionId,
      senderAddress,
      receiverAddress,
      amountUSD,
      amountUSDC,
      status,
      transactionHash,
      feeAmount,
      senderUserId,
      receiverUserId,
    },
  });
};

/**
 * Get transaction by ID
 * @param {string} transactionId - Transaction ID
 * @returns {Promise<Object|null>} Transaction or null if not found
 */
export const getById = async (transactionId) => {
  return await prisma.tipTransaction.findUnique({
    where: {
      transactionId,
    },
  });
};

/**
 * Get transaction by hash
 * @param {string} transactionHash - Transaction hash
 * @returns {Promise<Object|null>} Transaction or null if not found
 */
export const getByHash = async (transactionHash) => {
  return await prisma.tipTransaction.findFirst({
    where: {
      transactionHash,
    },
  });
};

/**
 * Get transactions by sender address
 * @param {string} senderAddress - Sender address
 * @param {number} skip - Number of records to skip
 * @param {number} take - Number of records to take
 * @returns {Promise<Array>} Array of transactions
 */
export const getBySender = async (senderAddress, skip = 0, take = 10) => {
  return await prisma.tipTransaction.findMany({
    where: {
      senderAddress,
    },
    orderBy: {
      timestamp: 'desc',
    },
    skip,
    take,
  });
};

/**
 * Get transactions by receiver address
 * @param {string} receiverAddress - Receiver address
 * @param {number} skip - Number of records to skip
 * @param {number} take - Number of records to take
 * @returns {Promise<Array>} Array of transactions
 */
export const getByReceiver = async (receiverAddress, skip = 0, take = 10) => {
  return await prisma.tipTransaction.findMany({
    where: {
      receiverAddress,
    },
    orderBy: {
      timestamp: 'desc',
    },
    skip,
    take,
  });
};

/**
 * Get transactions by status
 * @param {string} status - Transaction status
 * @param {number} skip - Number of records to skip
 * @param {number} take - Number of records to take
 * @returns {Promise<Array>} Array of transactions
 */
export const getByStatus = async (status, skip = 0, take = 10) => {
  return await prisma.tipTransaction.findMany({
    where: {
      status,
    },
    orderBy: {
      timestamp: 'desc',
    },
    skip,
    take,
  });
};

/**
 * Get all transactions
 * @param {number} skip - Number of records to skip
 * @param {number} take - Number of records to take
 * @returns {Promise<Array>} Array of transactions
 */
export const getAll = async (skip = 0, take = 10) => {
  return await prisma.tipTransaction.findMany({
    orderBy: {
      timestamp: 'desc',
    },
    skip,
    take,
  });
};

/**
 * Update transaction status
 * @param {string} transactionId - Transaction ID
 * @param {string} status - New status
 * @param {string} transactionHash - Transaction hash (optional)
 * @returns {Promise<Object>} Updated transaction
 */
export const updateStatus = async (
  transactionId,
  status,
  transactionHash = null
) => {
  return await prisma.tipTransaction.update({
    where: {
      transactionId,
    },
    data: {
      status,
      ...(transactionHash && { transactionHash }),
    },
  });
};

export const TipTransactionModel = {
  create,
  getById,
  getByHash,
  getBySender,
  getByReceiver,
  getByStatus,
  getAll,
  updateStatus,
};

