/**
 * Wallet authentication utilities
 */

import { UserModel } from '../models/user';

/**
 * Authenticate a user by wallet address
 * @param {string} walletAddress - User's wallet address
 * @returns {Promise<Object|null>} User object or null if not found
 */
export const authenticateByWallet = async (walletAddress) => {
  if (!walletAddress) return null;
  
  try {
    // Check if user exists
    const user = await UserModel.getByWalletAddress(walletAddress);
    
    if (user) {
      return user;
    }
    
    // Create new user if not found
    return await UserModel.create({
      userId: walletAddress, // Using wallet address as user ID for simplicity
      baseWalletAddress: walletAddress,
    });
  } catch (error) {
    console.error('Error authenticating user by wallet:', error);
    return null;
  }
};

/**
 * Get user's transaction history
 * @param {string} walletAddress - User's wallet address
 * @returns {Promise<Object>} Object containing sent and received transactions
 */
export const getUserTransactionHistory = async (walletAddress) => {
  if (!walletAddress) return { sent: [], received: [] };
  
  try {
    // Get user by wallet address
    const user = await UserModel.getByWalletAddress(walletAddress);
    
    if (!user) {
      return { sent: [], received: [] };
    }
    
    // Get user with transactions
    const userWithSentTips = await UserModel.getWithSentTips(user.userId);
    const userWithReceivedTips = await UserModel.getWithReceivedTips(user.userId);
    
    return {
      sent: userWithSentTips?.sentTips || [],
      received: userWithReceivedTips?.receivedTips || [],
    };
  } catch (error) {
    console.error('Error getting user transaction history:', error);
    return { sent: [], received: [] };
  }
};

/**
 * Update user's Farcaster ID
 * @param {string} walletAddress - User's wallet address
 * @param {string} farcasterId - User's Farcaster ID
 * @returns {Promise<Object|null>} Updated user or null if failed
 */
export const updateUserFarcasterId = async (walletAddress, farcasterId) => {
  if (!walletAddress || !farcasterId) return null;
  
  try {
    // Get user by wallet address
    const user = await UserModel.getByWalletAddress(walletAddress);
    
    if (!user) {
      return null;
    }
    
    // Update user
    return await UserModel.update(user.userId, { farcasterId });
  } catch (error) {
    console.error('Error updating user Farcaster ID:', error);
    return null;
  }
};

export default {
  authenticateByWallet,
  getUserTransactionHistory,
  updateUserFarcasterId,
};

