    'use client';

    const statusStyles = {
      pending: 'text-primary',
      success: 'text-accent',
      failed: 'text-red-500',
    };

    export default function TransactionStatusIndicator({ status }) {
      const message = {
        pending: 'Transaction pending...',
        success: 'Tip sent successfully!',
        failed: 'Transaction failed.',
      }[status];

      return (
        <div className={`mt-md p-md bg-surface rounded-md ${statusStyles[status]}`}>
          {message}
        </div>
      );
    }
  