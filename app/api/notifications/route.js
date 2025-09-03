import {
  getUserNotifications,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../../../lib/services/notificationService';

/**
 * Get notifications for a user
 * @route GET /api/notifications
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    if (!userId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'User ID is required',
        }),
        { status: 400 }
      );
    }

    const notifications = getUserNotifications(userId, unreadOnly);

    return new Response(
      JSON.stringify({
        success: true,
        data: notifications,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

/**
 * Create a new notification
 * @route POST /api/notifications
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, type, title, message, data } = body;

    if (!userId || !type || !title || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields',
        }),
        { status: 400 }
      );
    }

    const notification = addNotification({
      userId,
      type,
      title,
      message,
      data,
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: notification,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating notification:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

