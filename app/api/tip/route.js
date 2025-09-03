import { createTransaction } from '../../../lib/services/transactionService';
import { 
  createTipSentNotification, 
  createTipReceivedNotification 
} from '../../../lib/services/notificationService';
import { UserModel } from '../../../lib/models/user';
import { TipTransactionModel } from '../../../lib/models/tipTransaction';

/**
 * Create a new tip transaction
 * @route POST /api/tip
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
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
    } = body;

    // Validate required fields
    if (!senderAddress || !receiverAddress || !amountUSD || !amountUSDC) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields',
        }),
        { status: 400 }
      );
    }

    // Create transaction
    const transaction = await createTransaction({
      transactionId,
      senderAddress,
      receiverAddress,
      amountUSD,
      amountUSDC,
      status,
      transactionHash,
      feeAmount,
      senderUserId: senderUserId || senderAddress, // Use address as ID if not provided
      receiverUserId: receiverUserId || receiverAddress, // Use address as ID if not provided
    });

    // Create notifications
    if (transaction.senderUserId) {
      createTipSentNotification(transaction);
    }

    if (transaction.receiverUserId) {
      createTipReceivedNotification(transaction);
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: transaction,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating tip transaction:', error);
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
 * Get tip transactions
 * @route GET /api/tip
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const senderAddress = searchParams.get('senderAddress');
    const receiverAddress = searchParams.get('receiverAddress');
    const status = searchParams.get('status');
    const skip = parseInt(searchParams.get('skip') || '0');
    const take = parseInt(searchParams.get('take') || '10');

    let transactions;

    if (senderAddress) {
      // Get transactions by sender
      transactions = await TipTransactionModel.getBySender(
        senderAddress,
        skip,
        take
      );
    } else if (receiverAddress) {
      // Get transactions by receiver
      transactions = await TipTransactionModel.getByReceiver(
        receiverAddress,
        skip,
        take
      );
    } else if (status) {
      // Get transactions by status
      transactions = await TipTransactionModel.getByStatus(status, skip, take);
    } else {
      // Get all transactions
      transactions = await TipTransactionModel.getAll(skip, take);
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: transactions,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching tip transactions:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

