import { markNotificationAsRead } from '../../../../lib/services/notificationService';

/**
 * Mark notification as read
 * @route PUT /api/notifications/[id]
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { read } = body;

    if (read === undefined) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Read status is required',
        }),
        { status: 400 }
      );
    }

    const success = markNotificationAsRead(id);

    if (!success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Notification not found',
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Notification marked as read',
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

