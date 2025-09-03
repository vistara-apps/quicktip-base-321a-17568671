/**
 * Notification service for handling in-app notifications
 */

// Store notifications in memory (in a real app, this would be in a database)
let notifications = [];

/**
 * Add a new notification
 * @param {Object} notification - Notification object
 * @returns {Object} Added notification
 */
export const addNotification = (notification) => {
  const newNotification = {
    id: `notification-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date(),
    read: false,
    ...notification,
  };
  
  notifications.unshift(newNotification);
  
  // Keep only the latest 100 notifications
  if (notifications.length > 100) {
    notifications = notifications.slice(0, 100);
  }
  
  return newNotification;
};

/**
 * Get notifications for a user
 * @param {string} userId - User ID
 * @param {boolean} unreadOnly - Get only unread notifications
 * @returns {Array} Array of notifications
 */
export const getUserNotifications = (userId, unreadOnly = false) => {
  if (!userId) return [];
  
  return notifications.filter((notification) => {
    const userMatch = notification.userId === userId;
    const readMatch = unreadOnly ? !notification.read : true;
    return userMatch && readMatch;
  });
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @returns {boolean} Success status
 */
export const markNotificationAsRead = (notificationId) => {
  const notification = notifications.find((n) => n.id === notificationId);
  
  if (notification) {
    notification.read = true;
    return true;
  }
  
  return false;
};

/**
 * Mark all notifications as read for a user
 * @param {string} userId - User ID
 * @returns {number} Number of notifications marked as read
 */
export const markAllNotificationsAsRead = (userId) => {
  if (!userId) return 0;
  
  let count = 0;
  
  notifications.forEach((notification) => {
    if (notification.userId === userId && !notification.read) {
      notification.read = true;
      count++;
    }
  });
  
  return count;
};

/**
 * Create a tip sent notification
 * @param {Object} transaction - Transaction object
 * @returns {Object} Created notification
 */
export const createTipSentNotification = (transaction) => {
  return addNotification({
    userId: transaction.senderUserId,
    type: 'tip_sent',
    title: 'Tip Sent',
    message: `You sent $${parseFloat(transaction.amountUSD).toFixed(2)} to ${transaction.receiverAddress.slice(0, 6)}...${transaction.receiverAddress.slice(-4)}`,
    data: {
      transactionId: transaction.transactionId,
      amount: transaction.amountUSD,
      receiverAddress: transaction.receiverAddress,
    },
  });
};

/**
 * Create a tip received notification
 * @param {Object} transaction - Transaction object
 * @returns {Object} Created notification
 */
export const createTipReceivedNotification = (transaction) => {
  return addNotification({
    userId: transaction.receiverUserId,
    type: 'tip_received',
    title: 'Tip Received',
    message: `You received $${parseFloat(transaction.amountUSD).toFixed(2)} from ${transaction.senderAddress.slice(0, 6)}...${transaction.senderAddress.slice(-4)}`,
    data: {
      transactionId: transaction.transactionId,
      amount: transaction.amountUSD,
      senderAddress: transaction.senderAddress,
    },
  });
};

/**
 * Create a transaction status notification
 * @param {Object} transaction - Transaction object
 * @returns {Object} Created notification
 */
export const createTransactionStatusNotification = (transaction) => {
  const statusMessages = {
    success: 'Transaction completed successfully',
    failed: 'Transaction failed',
  };
  
  if (!statusMessages[transaction.status]) {
    return null;
  }
  
  return addNotification({
    userId: transaction.senderUserId,
    type: `transaction_${transaction.status}`,
    title: `Transaction ${transaction.status === 'success' ? 'Successful' : 'Failed'}`,
    message: statusMessages[transaction.status],
    data: {
      transactionId: transaction.transactionId,
      status: transaction.status,
    },
  });
};

export default {
  addNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createTipSentNotification,
  createTipReceivedNotification,
  createTransactionStatusNotification,
};

