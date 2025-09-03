import { TipTransactionModel } from '../../../lib/models/tipTransaction';

/**
 * Get all transactions
 * @route GET /api/transactions
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transactionId');
    const transactionHash = searchParams.get('transactionHash');
    const status = searchParams.get('status');
    const skip = parseInt(searchParams.get('skip') || '0');
    const take = parseInt(searchParams.get('take') || '10');

    let transactions;

    if (transactionId) {
      // Get transaction by ID
      const transaction = await TipTransactionModel.getById(transactionId);
      transactions = transaction ? [transaction] : [];
    } else if (transactionHash) {
      // Get transaction by hash
      const transaction = await TipTransactionModel.getByHash(transactionHash);
      transactions = transaction ? [transaction] : [];
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
        data: transactions 
      }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching transactions:', error);
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
 * Update transaction status
 * @route PUT /api/transactions
 */
export async function PUT(request) {
  try {
    const body = await request.json();
    const { transactionId, status, transactionHash } = body;

    // Validate required fields
    if (!transactionId || !status) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields' 
        }), 
        { status: 400 }
      );
    }

    // Check if transaction exists
    const existingTransaction = await TipTransactionModel.getById(transactionId);
    if (!existingTransaction) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Transaction not found' 
        }), 
        { status: 404 }
      );
    }

    // Update transaction status
    const updatedTransaction = await TipTransactionModel.updateStatus(
      transactionId, 
      status, 
      transactionHash
    );

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: updatedTransaction 
      }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating transaction:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }), 
      { status: 500 }
    );
  }
}

