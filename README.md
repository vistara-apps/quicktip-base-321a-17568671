# QuickTip Base

Send and receive instant tips on Base with ease.

## Overview

QuickTip Base is a Base mini-app that allows users to send and receive instant tips via USDC on the Base blockchain. The application provides a simple, user-friendly interface for tipping creators or friends with minimal setup.

## Features

- **Instant Tipping**: Send tips to creators or friends instantly using USDC on Base
- **USDC Payment Integration**: Leverages Circle's USDC on Base for all tip transactions
- **Simple Tipping Page**: Clean, minimalist interface for quick and easy tipping
- **Tiered Tipping Options**: Predefined tip amounts with optional custom amounts
- **Transaction History**: View your sent and received tips
- **Profile Management**: Manage your profile and connect your Farcaster ID
- **Notifications**: Real-time notifications for tip events
- **Fee Mechanism**: 1% fee on all transactions to support the platform

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Blockchain**: Base (Ethereum L2), USDC
- **Wallet Integration**: Coinbase OnchainKit, Wagmi, Viem
- **Database**: Prisma ORM
- **API**: Next.js API Routes

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Base Wallet or any Ethereum wallet that supports Base

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/quicktip-base.git
   cd quicktip-base
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration.

4. Run the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Documentation

- [User Documentation](./docs/user-documentation.md)
- [API Documentation](./docs/api-documentation.md)
- [Technical Documentation](./docs/technical-documentation.md)

## Business Model

QuickTip Base uses a micro-transaction business model with a small percentage fee (1%) on each successful tip transaction. This model aligns with the nature of tipping, where instant, small value transactions are common.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Base](https://base.org) - The L2 blockchain platform
- [Coinbase OnchainKit](https://docs.base.org/base-app/build-with-minikit/quickstart) - For wallet integration
- [Wagmi](https://wagmi.sh) - For React hooks for Ethereum
- [Next.js](https://nextjs.org) - The React framework
- [TailwindCSS](https://tailwindcss.com) - For styling

