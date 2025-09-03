'use client';

import { useState, useEffect } from 'react';
import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { base } from 'viem/chains';

const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'; // USDC on Base

export default function WalletConnection() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get user's USDC balance
  const { data: balanceData } = useBalance({
    address,
    token: USDC_ADDRESS,
  });
  
  // Get user's ETH balance
  const { data: ethBalanceData } = useBalance({
    address,
  });

  // Register user in the database when connected
  useEffect(() => {
    const registerUser = async () => {
      if (isConnected && address) {
        setIsLoading(true);
        setError(null);
        
        try {
          // Check if user exists
          const checkResponse = await fetch(`/api/users?walletAddress=${address}`);
          const checkData = await checkResponse.json();
          
          // If user doesn't exist, create one
          if (!checkData.data || checkData.data.length === 0) {
            const response = await fetch('/api/users', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: address, // Using address as user ID for simplicity
                baseWalletAddress: address,
              }),
            });
            
            if (!response.ok) {
              throw new Error('Failed to register user');
            }
          }
        } catch (err) {
          console.error('Error registering user:', err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    registerUser();
  }, [isConnected, address]);

  // Handle disconnect
  const handleDisconnect = () => {
    disconnect();
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center">
        <p className="text-body mb-md text-center">Connect your wallet to send tips on Base</p>
        <Wallet>
          <ConnectWallet />
        </Wallet>
      </div>
    );
  }

  return (
    <div className="bg-surface shadow-card rounded-lg p-md">
      <div className="flex justify-between items-center mb-md">
        <h2 className="text-body font-bold">Wallet Connected</h2>
        <button
          onClick={handleDisconnect}
          className="text-sm text-red-500 hover:text-red-400"
        >
          Disconnect
        </button>
      </div>
      
      <div className="mb-sm">
        <p className="text-sm text-gray-400">Address:</p>
        <p className="text-body break-all">{address}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-x-4 mt-md">
        {balanceData && (
          <div>
            <p className="text-sm text-gray-400">USDC Balance:</p>
            <p className="text-body font-bold">
              {parseFloat(balanceData?.formatted).toFixed(2)} {balanceData?.symbol}
            </p>
          </div>
        )}
        
        {ethBalanceData && (
          <div>
            <p className="text-sm text-gray-400">ETH Balance:</p>
            <p className="text-body font-bold">
              {parseFloat(ethBalanceData?.formatted).toFixed(4)} {ethBalanceData?.symbol}
            </p>
          </div>
        )}
      </div>
      
      {isLoading && <p className="text-sm text-primary mt-sm">Loading...</p>}
      {error && <p className="text-sm text-red-500 mt-sm">Error: {error}</p>}
    </div>
  );
}

