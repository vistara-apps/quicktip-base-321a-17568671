import { UserModel } from '../../../../lib/models/user';
import { TipTransactionModel } from '../../../../lib/models/tipTransaction';

/**
 * Get user by ID
 * @route GET /api/users/[id]
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const includeTips = searchParams.get('includeTips');

    let user;

    if (includeTips === 'sent') {
      // Get user with sent tips
      user = await UserModel.getWithSentTips(id);
    } else if (includeTips === 'received') {
      // Get user with received tips
      user = await UserModel.getWithReceivedTips(id);
    } else if (includeTips === 'all') {
      // Get user with all tips
      const userWithSentTips = await UserModel.getWithSentTips(id);
      const userWithReceivedTips = await UserModel.getWithReceivedTips(id);
      
      if (!userWithSentTips) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'User not found' 
          }), 
          { status: 404 }
        );
      }
      
      user = {
        ...userWithSentTips,
        receivedTips: userWithReceivedTips?.receivedTips || [],
      };
    } else {
      // Get user without tips
      user = await UserModel.getById(id);
    }

    if (!user) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'User not found' 
        }), 
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: user 
      }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }), 
      { status: 500 }
    );
  }
}

/**
 * Update user
 * @route PUT /api/users/[id]
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { farcasterId, baseWalletAddress } = body;

    // Check if user exists
    const existingUser = await UserModel.getById(id);
    if (!existingUser) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'User not found' 
        }), 
        { status: 404 }
      );
    }

    // Update user
    const updatedUser = await UserModel.update(id, {
      ...(farcasterId !== undefined && { farcasterId }),
      ...(baseWalletAddress !== undefined && { baseWalletAddress }),
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: updatedUser 
      }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }), 
      { status: 500 }
    );
  }
}

/**
 * Delete user
 * @route DELETE /api/users/[id]
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Check if user exists
    const existingUser = await UserModel.getById(id);
    if (!existingUser) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'User not found' 
        }), 
        { status: 404 }
      );
    }

    // Delete user
    await UserModel.delete(id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'User deleted successfully' 
      }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }), 
      { status: 500 }
    );
  }
}

