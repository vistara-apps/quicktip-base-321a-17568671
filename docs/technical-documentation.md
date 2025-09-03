# QuickTip Base Technical Documentation

This document provides technical documentation for the QuickTip Base application, including architecture, data models, and implementation details.

## Architecture Overview

QuickTip Base is built using the following technologies:

- **Frontend**: Next.js with React
- **Styling**: TailwindCSS
- **Blockchain Integration**: Wagmi, Viem, Coinbase OnchainKit
- **Database**: Prisma ORM (with a database backend)
- **API**: Next.js API Routes

The application follows a client-server architecture with the frontend communicating with the backend via RESTful API endpoints.

## Directory Structure

```
/
├── app/                    # Next.js app directory
│   ├── api/                # API routes
│   │   ├── notifications/  # Notification endpoints
│   │   ├── tip/            # Tip transaction endpoints
│   │   ├── transactions/   # Transaction management endpoints
│   │   └── users/          # User management endpoints
│   ├── components/         # React components
│   ├── profile/            # Profile page
│   └── page.jsx            # Home page
├── lib/                    # Library code
│   ├── auth/               # Authentication utilities
│   ├── models/             # Data models
│   ├── services/           # Business logic services
│   └── utils/              # Utility functions
├── prisma/                 # Prisma schema and migrations
├── public/                 # Static assets
└── docs/                   # Documentation
```

## Data Models

### User

The User model represents a user of the application.

```prisma
model User {
  userId           String    @id @default(uuid())
  farcasterId      String?
  baseWalletAddress String
  createdAt        DateTime  @default(now())
  sentTips         TipTransaction[] @relation("SenderUser")
  receivedTips     TipTransaction[] @relation("ReceiverUser")
}
```

### TipTransaction

The TipTransaction model represents a tip transaction between users.

```prisma
model TipTransaction {
  transactionId    String    @id @default(uuid())
  senderAddress    String
  receiverAddress  String
  amountUSD        Float
  amountUSDC       String
  status           String    @default("pending") // pending, success, failed
  transactionHash  String?
  timestamp        DateTime  @default(now())
  feeAmount        Float     @default(0)
  senderUserId     String?
  receiverUserId   String?
  sender           User?     @relation("SenderUser", fields: [senderUserId], references: [userId])
  receiver         User?     @relation("ReceiverUser", fields: [receiverUserId], references: [userId])
}
```

## Core Components

### WalletConnection

Handles wallet connection and authentication using Coinbase OnchainKit and Wagmi.

### TipSelector

Provides a UI for selecting tip amounts, including predefined options and custom amounts.

### ProfileCard

Displays user profile information, including wallet address and Farcaster ID.

### TransactionStatusIndicator

Shows the status of a transaction (pending, success, failed) with relevant details.

### NotificationCenter

Manages and displays user notifications.

## Key Services

### Transaction Service

Handles the creation, retrieval, and updating of tip transactions.

```javascript
// Key functions
createTransaction(transactionData)
updateTransactionStatus(transactionId, status, transactionHash)
getUserTransactionHistory(address)
```

### Notification Service

Manages user notifications, including creation and marking as read.

```javascript
// Key functions
addNotification(notification)
getUserNotifications(userId, unreadOnly)
markNotificationAsRead(notificationId)
markAllNotificationsAsRead(userId)
```

### Fee Calculator

Calculates transaction fees based on the business model (1% fee).

```javascript
// Key functions
calculateFeeAmount(amountUSD)
calculateNetAmount(amountUSD)
```

## Blockchain Integration

The application integrates with the Base blockchain using the following components:

### Wallet Connection

Uses Coinbase OnchainKit's `ConnectWallet` component to connect to Base Wallet.

### Transaction Processing

Uses Wagmi's `useWriteContract` hook to send USDC transactions on the Base blockchain.

```javascript
writeContract({
  address: USDC_ADDRESS,
  abi: [...],
  functionName: 'transfer',
  args: [recipientAddress, amount],
  chainId: base.id,
});
```

### Transaction Monitoring

Uses Wagmi's `useWaitForTransactionReceipt` hook to monitor transaction status.

## Fee Mechanism

The application implements a 1% fee on all tip transactions:

1. User initiates a tip transaction for a specific amount
2. The fee is calculated (1% of the tip amount)
3. Two separate transactions are created:
   - Main transaction to the recipient (original amount minus fee)
   - Fee transaction to the platform wallet

## Authentication Flow

1. User connects their Base Wallet
2. Application checks if the user exists in the database
3. If not, a new user record is created with the wallet address
4. User is authenticated based on their connected wallet

## Notification System

The application implements an in-memory notification system:

1. Notifications are created for various events:
   - Tip sent
   - Tip received
   - Transaction status changes
2. Notifications are stored with user ID, type, title, message, and read status
3. Users can view and mark notifications as read

## API Structure

The API follows RESTful principles with the following main endpoints:

- `/api/users`: User management
- `/api/tip`: Tip transaction creation
- `/api/transactions`: Transaction management
- `/api/notifications`: Notification management

See the [API Documentation](./api-documentation.md) for detailed endpoint specifications.

## Error Handling

The application implements consistent error handling:

1. Client-side errors are caught and displayed to the user
2. API endpoints return standardized error responses
3. Transaction errors are tracked and displayed in the UI

## Performance Considerations

- Pagination is implemented for transaction and notification lists
- In-memory caching is used for frequently accessed data
- Optimistic UI updates are used for better user experience

## Security Considerations

- No sensitive data is stored in local storage
- Wallet addresses are validated before processing transactions
- Transaction amounts are validated to prevent negative or zero amounts
- Fee calculations are performed server-side to prevent tampering

## Future Enhancements

1. **Persistent Notifications**: Move from in-memory to database storage
2. **Webhook Support**: Add webhook support for external integrations
3. **Enhanced Analytics**: Add transaction analytics and reporting
4. **Custom Branding**: Allow users to customize their tipping pages
5. **Token Gating**: Implement token-gated access for premium features

