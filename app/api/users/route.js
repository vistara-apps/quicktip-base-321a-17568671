import { UserModel } from '../../../lib/models/user';

/**
 * Get all users
 * @route GET /api/users
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');
    const skip = parseInt(searchParams.get('skip') || '0');
    const take = parseInt(searchParams.get('take') || '10');

    let users;

    if (walletAddress) {
      // Get user by wallet address
      const user = await UserModel.getByWalletAddress(walletAddress);
      users = user ? [user] : [];
    } else {
      // Get all users
      users = await UserModel.getAll(skip, take);
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: users,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching users:', error);
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
 * Create a new user
 * @route POST /api/users
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, farcasterId, baseWalletAddress } = body;

    // Validate required fields
    if (!baseWalletAddress) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Wallet address is required',
        }),
        { status: 400 }
      );
    }

    // Check if user with this wallet address already exists
    const existingUser = await UserModel.getByWalletAddress(baseWalletAddress);
    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'User with this wallet address already exists',
        }),
        { status: 409 }
      );
    }

    // Create user
    const user = await UserModel.create({
      userId,
      farcasterId,
      baseWalletAddress,
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: user,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

