'use client';

const statusStyles = {
  pending: 'text-primary',
  success: 'text-accent',
  failed: 'text-red-500',
};

const statusIcons = {
  pending: '⏳',
  success: '✅',
  failed: '❌',
};

export default function TransactionStatusIndicator({ 
  status, 
  transactionHash, 
  amount, 
  fee 
}) {
  const baseMessage = {
    pending: 'Transaction pending...',
    success: 'Tip sent successfully!',
    failed: 'Transaction failed.',
  }[status];

  // Format transaction details
  const formattedAmount = amount ? `$${amount.toFixed(2)}` : '';
  const formattedFee = fee ? `$${fee.toFixed(2)}` : '';
  const netAmount = amount && fee ? `$${(amount - fee).toFixed(2)}` : '';

  // Create transaction explorer link
  const explorerLink = transactionHash 
    ? `https://basescan.org/tx/${transactionHash}`
    : null;

  return (
    <div className={`p-md bg-surface rounded-md ${statusStyles[status]}`}>
      <div className="flex items-center mb-sm">
        <span className="mr-sm">{statusIcons[status]}</span>
        <span className="font-bold">{baseMessage}</span>
      </div>
      
      {/* Show transaction details if available */}
      {amount && (
        <div className="text-sm mt-sm">
          <div className="grid grid-cols-2 gap-x-2">
            <span className="text-gray-400">Total Amount:</span>
            <span>{formattedAmount}</span>
            
            {fee > 0 && (
              <>
                <span className="text-gray-400">Platform Fee (1%):</span>
                <span>{formattedFee}</span>
                
                <span className="text-gray-400">Net Amount:</span>
                <span>{netAmount}</span>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Show transaction link if available */}
      {explorerLink && (
        <div className="mt-sm">
          <a 
            href={explorerLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary underline text-sm"
          >
            View on BaseScan
          </a>
        </div>
      )}
    </div>
  );
}
