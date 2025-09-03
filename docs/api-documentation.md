# QuickTip Base API Documentation

This document provides comprehensive documentation for the QuickTip Base API endpoints.

## Base URL

All API endpoints are relative to the base URL of the application.

## Authentication

Currently, the API does not require authentication tokens. User identification is done through wallet addresses.

## Error Handling

All API endpoints return a consistent error format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

## Success Responses

Successful responses follow this format:

```json
{
  "success": true,
  "data": { ... } // Response data varies by endpoint
}
```

## API Endpoints

### User Management

#### Get Users

```
GET /api/users
```

Query Parameters:
- `walletAddress` (optional): Filter users by wallet address

Response:
```json
{
  "success": true,
  "data": [
    {
      "userId": "string",
      "farcasterId": "string|null",
      "baseWalletAddress": "string",
      "createdAt": "ISO date string"
    }
  ]
}
```

#### Get User by ID

```
GET /api/users/:id
```

Query Parameters:
- `includeTips` (optional): Include user's tips. Values: "sent", "received", "all"

Response:
```json
{
  "success": true,
  "data": {
    "userId": "string",
    "farcasterId": "string|null",
    "baseWalletAddress": "string",
    "createdAt": "ISO date string",
    "sentTips": [ ... ], // Only if includeTips is "sent" or "all"
    "receivedTips": [ ... ] // Only if includeTips is "received" or "all"
  }
}
```

#### Create User

```
POST /api/users
```

Request Body:
```json
{
  "userId": "string", // Optional, generated if not provided
  "farcasterId": "string", // Optional
  "baseWalletAddress": "string" // Required
}
```

Response:
```json
{
  "success": true,
  "data": {
    "userId": "string",
    "farcasterId": "string|null",
    "baseWalletAddress": "string",
    "createdAt": "ISO date string"
  }
}
```

#### Update User

```
PUT /api/users/:id
```

Request Body:
```json
{
  "farcasterId": "string", // Optional
  "baseWalletAddress": "string" // Optional
}
```

Response:
```json
{
  "success": true,
  "data": {
    "userId": "string",
    "farcasterId": "string|null",
    "baseWalletAddress": "string",
    "createdAt": "ISO date string"
  }
}
```

#### Delete User

```
DELETE /api/users/:id
```

Response:
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Transaction Management

#### Create Tip Transaction

```
POST /api/tip
```

Request Body:
```json
{
  "transactionId": "string", // Optional, generated if not provided
  "senderAddress": "string", // Required
  "receiverAddress": "string", // Required
  "amountUSD": "number", // Required
  "amountUSDC": "string", // Required
  "status": "string", // Optional, default: "pending"
  "transactionHash": "string", // Optional
  "feeAmount": "number", // Optional, calculated if not provided
  "senderUserId": "string", // Optional
  "receiverUserId": "string" // Optional
}
```

Response:
```json
{
  "success": true,
  "data": {
    "transactionId": "string",
    "senderAddress": "string",
    "receiverAddress": "string",
    "amountUSD": "number",
    "amountUSDC": "string",
    "status": "string",
    "transactionHash": "string|null",
    "timestamp": "ISO date string",
    "feeAmount": "number"
  }
}
```

#### Get Transactions

```
GET /api/transactions
```

Query Parameters:
- `transactionId` (optional): Filter by transaction ID
- `transactionHash` (optional): Filter by transaction hash
- `status` (optional): Filter by status
- `skip` (optional): Number of records to skip (pagination)
- `take` (optional): Number of records to take (pagination)

Response:
```json
{
  "success": true,
  "data": [
    {
      "transactionId": "string",
      "senderAddress": "string",
      "receiverAddress": "string",
      "amountUSD": "number",
      "amountUSDC": "string",
      "status": "string",
      "transactionHash": "string|null",
      "timestamp": "ISO date string",
      "feeAmount": "number"
    }
  ]
}
```

#### Update Transaction Status

```
PUT /api/transactions
```

Request Body:
```json
{
  "transactionId": "string", // Required
  "status": "string", // Required
  "transactionHash": "string" // Optional
}
```

Response:
```json
{
  "success": true,
  "data": {
    "transactionId": "string",
    "senderAddress": "string",
    "receiverAddress": "string",
    "amountUSD": "number",
    "amountUSDC": "string",
    "status": "string",
    "transactionHash": "string|null",
    "timestamp": "ISO date string",
    "feeAmount": "number"
  }
}
```

### Notification Management

#### Get Notifications

```
GET /api/notifications
```

Query Parameters:
- `userId` (required): User ID to get notifications for
- `unreadOnly` (optional): If "true", only return unread notifications

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "userId": "string",
      "type": "string",
      "title": "string",
      "message": "string",
      "data": "object|null",
      "read": "boolean",
      "timestamp": "ISO date string"
    }
  ]
}
```

#### Create Notification

```
POST /api/notifications
```

Request Body:
```json
{
  "userId": "string", // Required
  "type": "string", // Required
  "title": "string", // Required
  "message": "string", // Required
  "data": "object" // Optional
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "userId": "string",
    "type": "string",
    "title": "string",
    "message": "string",
    "data": "object|null",
    "read": false,
    "timestamp": "ISO date string"
  }
}
```

#### Mark Notification as Read

```
PUT /api/notifications/:id
```

Request Body:
```json
{
  "read": true
}
```

Response:
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

#### Mark All Notifications as Read

```
PUT /api/notifications/mark-all-read
```

Request Body:
```json
{
  "userId": "string" // Required
}
```

Response:
```json
{
  "success": true,
  "message": "X notifications marked as read",
  "count": "number"
}
```

## Data Models

### User

```json
{
  "userId": "string",
  "farcasterId": "string|null",
  "baseWalletAddress": "string",
  "createdAt": "ISO date string"
}
```

### Transaction

```json
{
  "transactionId": "string",
  "senderAddress": "string",
  "receiverAddress": "string",
  "amountUSD": "number",
  "amountUSDC": "string",
  "status": "string", // "pending", "success", "failed"
  "transactionHash": "string|null",
  "timestamp": "ISO date string",
  "feeAmount": "number"
}
```

### Notification

```json
{
  "id": "string",
  "userId": "string",
  "type": "string", // "tip_sent", "tip_received", "transaction_success", "transaction_failed"
  "title": "string",
  "message": "string",
  "data": "object|null",
  "read": "boolean",
  "timestamp": "ISO date string"
}
```

## Error Codes

- `400`: Bad Request - Missing or invalid parameters
- `404`: Not Found - Resource not found
- `500`: Internal Server Error - Something went wrong on the server

## Rate Limiting

Currently, there are no rate limits implemented for the API.

## Webhook Support

Webhook support is planned for future versions to notify external systems of events like successful transactions.

