'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export default function NotificationCenter() {
  const { address, isConnected } = useAccount();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch notifications when wallet is connected
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isConnected || !address) return;

      setIsLoading(true);

      try {
        const response = await fetch(`/api/notifications?userId=${address}`);
        const data = await response.json();

        if (data.success) {
          setNotifications(data.data);
          setUnreadCount(data.data.filter((n) => !n.read).length);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
    
    // Set up polling for new notifications
    const interval = setInterval(fetchNotifications, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [isConnected, address]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: true }),
      });

      const data = await response.json();

      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch(`/api/notifications/mark-all-read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: address }),
      });

      const data = await response.json();

      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, read: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Toggle notification panel
  const toggleNotifications = () => {
    setIsOpen((prev) => !prev);
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'tip_sent':
        return '↗️';
      case 'tip_received':
        return '↘️';
      case 'transaction_success':
        return '✅';
      case 'transaction_failed':
        return '❌';
      default:
        return '🔔';
    }
  };

  if (!isConnected) return null;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={toggleNotifications}
        className="relative p-sm rounded-full hover:bg-surface transition duration-base"
        aria-label="Notifications"
      >
        <span className="text-lg">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-sm w-80 max-h-96 overflow-y-auto bg-surface rounded-md shadow-card z-10">
          <div className="flex justify-between items-center p-sm border-b border-gray-700">
            <h3 className="text-body font-bold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="p-md text-center">
              <p className="text-gray-400">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-md text-center">
              <p className="text-gray-400">No notifications</p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-sm border-b border-gray-700 hover:bg-opacity-50 ${
                    !notification.read ? 'bg-primary bg-opacity-10' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start">
                    <span className="mr-sm text-lg">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div>
                      <p className="text-sm font-bold">{notification.title}</p>
                      <p className="text-xs text-gray-400">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

