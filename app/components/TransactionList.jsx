'use client';

export default function TransactionList({ transactions, type }) {
  // Sort transactions by timestamp (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  if (sortedTransactions.length === 0) {
    return (
      <div className="text-center py-md">
        <p className="text-gray-400">No {type} transactions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-md">
      {sortedTransactions.map((tx) => (
        <div
          key={tx.id || tx.transactionId}
          className="bg-surface rounded-md p-md"
        >
          <div className="flex justify-between items-start mb-sm">
            <div>
              <p className="text-sm">
                <span className="text-gray-400">
                  {type === 'sent' ? 'To:' : 'From:'}
                </span>{' '}
                {type === 'sent'
                  ? `${tx.receiverAddress.slice(0, 6)}...${tx.receiverAddress.slice(-4)}`
                  : `${tx.senderAddress.slice(0, 6)}...${tx.senderAddress.slice(-4)}`}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(tx.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-body font-bold">${parseFloat(tx.amountUSD).toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">
                {tx.amountUSDC} USDC
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-sm pt-sm border-t border-gray-700">
            <div className="flex items-center">
              <span
                className={`inline-block w-2 h-2 rounded-full mr-sm ${
                  tx.status === 'success'
                    ? 'bg-green-500'
                    : tx.status === 'pending'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
              ></span>
              <span className="text-xs capitalize">{tx.status}</span>
            </div>
            {tx.transactionHash && (
              <a
                href={`https://basescan.org/tx/${tx.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                View on BaseScan
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

