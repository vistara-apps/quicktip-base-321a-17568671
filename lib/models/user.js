/**
 * User model implementation
 */

import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
export const create = async (userData) => {
  const { userId = uuidv4(), farcasterId, baseWalletAddress } = userData;

  return await prisma.user.create({
    data: {
      userId,
      farcasterId,
      baseWalletAddress,
    },
  });
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User or null if not found
 */
export const getById = async (userId) => {
  return await prisma.user.findUnique({
    where: {
      userId,
    },
  });
};

/**
 * Get user by wallet address
 * @param {string} walletAddress - Wallet address
 * @returns {Promise<Object|null>} User or null if not found
 */
export const getByWalletAddress = async (walletAddress) => {
  return await prisma.user.findFirst({
    where: {
      baseWalletAddress: walletAddress,
    },
  });
};

/**
 * Get all users
 * @param {number} skip - Number of records to skip
 * @param {number} take - Number of records to take
 * @returns {Promise<Array>} Array of users
 */
export const getAll = async (skip = 0, take = 10) => {
  return await prisma.user.findMany({
    skip,
    take,
  });
};

/**
 * Get user with sent tips
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User with sent tips or null if not found
 */
export const getWithSentTips = async (userId) => {
  return await prisma.user.findUnique({
    where: {
      userId,
    },
    include: {
      sentTips: {
        orderBy: {
          timestamp: 'desc',
        },
      },
    },
  });
};

/**
 * Get user with received tips
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User with received tips or null if not found
 */
export const getWithReceivedTips = async (userId) => {
  return await prisma.user.findUnique({
    where: {
      userId,
    },
    include: {
      receivedTips: {
        orderBy: {
          timestamp: 'desc',
        },
      },
    },
  });
};

/**
 * Update user
 * @param {string} userId - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} Updated user
 */
export const update = async (userId, userData) => {
  return await prisma.user.update({
    where: {
      userId,
    },
    data: userData,
  });
};

/**
 * Delete user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Deleted user
 */
export const deleteUser = async (userId) => {
  return await prisma.user.delete({
    where: {
      userId,
    },
  });
};

export const UserModel = {
  create,
  getById,
  getByWalletAddress,
  getAll,
  getWithSentTips,
  getWithReceivedTips,
  update,
  delete: deleteUser,
};

