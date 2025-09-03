import { markAllNotificationsAsRead } from '../../../../lib/services/notificationService';

/**
 * Mark all notifications as read for a user
 * @route PUT /api/notifications/mark-all-read
 */
export async function PUT(request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'User ID is required',
        }),
        { status: 400 }
      );
    }

    const count = markAllNotificationsAsRead(userId);

    return new Response(
      JSON.stringify({
        success: true,
        message: `${count} notifications marked as read`,
        count,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

