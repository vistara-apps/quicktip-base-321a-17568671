'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import WalletConnection from '../components/WalletConnection';
import ProfileEditor from '../components/ProfileEditor';
import TransactionList from '../components/TransactionList';

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState({ sent: [], received: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('sent');

  // Fetch user data and transactions
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isConnected || !address) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch user data
        const userResponse = await fetch(`/api/users?walletAddress=${address}`);
        const userData = await userResponse.json();

        if (userData.success && userData.data.length > 0) {
          setUserData(userData.data[0]);

          // Fetch sent transactions
          const sentResponse = await fetch(`/api/tip?senderAddress=${address}`);
          const sentData = await sentResponse.json();

          // Fetch received transactions
          const receivedResponse = await fetch(`/api/tip?receiverAddress=${address}`);
          const receivedData = await receivedResponse.json();

          setTransactions({
            sent: sentData.success ? sentData.data : [],
            received: receivedData.success ? receivedData.data : [],
          });
        } else {
          setError('User not found');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isConnected, address]);

  // Handle profile update
  const handleProfileUpdate = async (updatedData) => {
    if (!userData?.userId) return;

    try {
      const response = await fetch(`/api/users/${userData.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (data.success) {
        setUserData(data.data);
        return true;
      } else {
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      return false;
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-display text-center mb-md">Your Profile</h1>

      {/* Wallet Connection */}
      <WalletConnection />

      {isConnected ? (
        <>
          {isLoading ? (
            <div className="text-center py-lg">
              <p className="text-primary">Loading profile data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500 bg-opacity-20 text-red-500 p-md rounded-md mt-md">
              <p>{error}</p>
            </div>
          ) : (
            <div className="mt-lg">
              {/* Profile Editor */}
              <ProfileEditor 
                userData={userData} 
                onUpdate={handleProfileUpdate} 
              />

              {/* Transaction History */}
              <div className="mt-lg">
                <h2 className="text-body font-bold mb-md">Transaction History</h2>
                
                {/* Tabs */}
                <div className="flex border-b border-gray-700 mb-md">
                  <button
                    className={`py-sm px-md ${activeTab === 'sent' ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('sent')}
                  >
                    Sent ({transactions.sent.length})
                  </button>
                  <button
                    className={`py-sm px-md ${activeTab === 'received' ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('received')}
                  >
                    Received ({transactions.received.length})
                  </button>
                </div>
                
                {/* Transaction List */}
                <TransactionList 
                  transactions={activeTab === 'sent' ? transactions.sent : transactions.received} 
                  type={activeTab}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-lg">
          <p className="text-body">Connect your wallet to view your profile</p>
        </div>
      )}
      
      {/* Back to Home Button */}
      <div className="mt-lg text-center">
        <button
          onClick={() => router.push('/')}
          className="text-primary hover:underline"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

