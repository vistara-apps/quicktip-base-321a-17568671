'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useBalance } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { base } from 'viem/chains';
import { useRouter } from 'next/navigation';
import ProfileCard from './components/ProfileCard';
import TipButton from './components/TipButton';
import NumericInput from './components/NumericInput';
import TransactionStatusIndicator from './components/TransactionStatusIndicator';
import WalletConnection from './components/WalletConnection';
import TipSelector from './components/TipSelector';
import NotificationCenter from './components/NotificationCenter';
import { 
  FEE_RECIPIENT_ADDRESS, 
  calculateFeeAmount, 
  calculateNetAmount 
} from '../lib/utils/feeCalculator';

const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'; // USDC on Base
const RECIPIENT_ADDRESS = '0x000000000000000000000000000000000000dead'; // Hardcoded recipient for demo
const DECIMALS = 6;

export default function Home() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [status, setStatus] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [recipientAddress, setRecipientAddress] = useState(RECIPIENT_ADDRESS);
  
  // Get user's USDC balance
  const { data: balanceData } = useBalance({
    address,
    token: USDC_ADDRESS,
  });

  // Save transaction to database
  const saveTransaction = async (txData) => {
    try {
      const response = await fetch('/api/tip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(txData),
      });
      
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error saving transaction:', error);
      return false;
    }
  };

  // Update transaction status
  const updateTransactionStatus = async (transactionId, status, transactionHash = null) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId,
          status,
          transactionHash,
        }),
      });
      
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error updating transaction status:', error);
      return false;
    }
  };

  const sendTip = async (amountUSD) => {
    try {
      // Calculate fee and net amount
      const feeAmount = calculateFeeAmount(amountUSD);
      const netAmount = calculateNetAmount(amountUSD);
      
      // Convert to USDC with proper decimals
      const amountUSDC = parseUnits(amountUSD.toString(), DECIMALS);
      const feeAmountUSDC = parseUnits(feeAmount.toString(), DECIMALS);
      const netAmountUSDC = parseUnits(netAmount.toString(), DECIMALS);
      
      // Generate a unique transaction ID
      const transactionId = `tip-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Save initial transaction record
      const txData = {
        transactionId,
        senderAddress: address,
        receiverAddress: recipientAddress,
        amountUSD: amountUSD,
        amountUSDC: formatUnits(amountUSDC, DECIMALS),
        status: 'pending',
        feeAmount,
        senderUserId: address, // Using address as user ID for simplicity
      };
      
      await saveTransaction(txData);
      
      // Store transaction details for later use
      setTransactionDetails({
        ...txData,
        netAmountUSDC,
        feeAmountUSDC,
      });
      
      // Send the transaction
      writeContract({
        address: USDC_ADDRESS,
        abi: [{
          constant: false,
          inputs: [
            { name: 'to', type: 'address' },
            { name: 'value', type: 'uint256' },
          ],
          name: 'transfer',
          outputs: [{ name: '', type: 'bool' }],
          type: 'function',
        }],
        functionName: 'transfer',
        args: [recipientAddress, netAmountUSDC], // Send net amount to recipient
        chainId: base.id,
      });
      
      // Send fee to fee recipient
      if (feeAmount > 0) {
        writeContract({
          address: USDC_ADDRESS,
          abi: [{
            constant: false,
            inputs: [
              { name: 'to', type: 'address' },
              { name: 'value', type: 'uint256' },
            ],
            name: 'transfer',
            outputs: [{ name: '', type: 'bool' }],
            type: 'function',
          }],
          functionName: 'transfer',
          args: [FEE_RECIPIENT_ADDRESS, feeAmountUSDC], // Send fee to fee recipient
          chainId: base.id,
        });
      }
      
      setStatus('pending');
    } catch (err) {
      console.error('Error initiating tip:', err);
      setStatus('failed');
      
      // Update transaction status if we have transaction details
      if (transactionDetails?.transactionId) {
        await updateTransactionStatus(transactionDetails.transactionId, 'failed');
      }
    }
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
  };
  
  const handleSendTip = () => {
    if (selectedAmount && selectedAmount > 0) {
      sendTip(selectedAmount);
    }
  };

  // Update status based on transaction receipt
  useEffect(() => {
    const updateStatus = async () => {
      if (hash && isConfirming) {
        setStatus('pending');
      } else if (receipt?.status === 'success') {
        setStatus('success');
        
        // Update transaction status if we have transaction details
        if (transactionDetails?.transactionId) {
          await updateTransactionStatus(
            transactionDetails.transactionId, 
            'success', 
            hash
          );
        }
      } else if (error) {
        setStatus('failed');
        
        // Update transaction status if we have transaction details
        if (transactionDetails?.transactionId) {
          await updateTransactionStatus(transactionDetails.transactionId, 'failed');
        }
      }
    };
    
    updateStatus();
  }, [hash, isConfirming, receipt, error, transactionDetails]);

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-lg">
        <h1 className="text-display">QuickTip Base</h1>
        {isConnected && <NotificationCenter />}
      </div>
      <p className="text-body text-center mb-lg">Send and receive instant tips on Base with ease</p>
      
      {/* Wallet Connection Component */}
      <WalletConnection />
      
      {isConnected && (
        <div className="mt-lg">
          <ProfileCard address={recipientAddress} />
          
          <div className="mt-md">
            <TipSelector onSelectAmount={handleAmountSelect} />
            
            <div className="mt-md">
              <button
                onClick={handleSendTip}
                disabled={!selectedAmount || selectedAmount <= 0}
                className={`w-full py-md bg-accent text-white font-bold rounded-md hover:bg-opacity-90 transition duration-base ${
                  (!selectedAmount || selectedAmount <= 0) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Send ${selectedAmount ? selectedAmount.toFixed(2) : '0.00'} Tip
              </button>
              <p className="text-xs text-gray-400 mt-sm text-center">
                Note: A 1% fee will be applied to all tips
              </p>
            </div>
          </div>
          
          {status && (
            <div className="mt-md">
              <TransactionStatusIndicator 
                status={status} 
                transactionHash={hash}
                amount={transactionDetails?.amountUSD}
                fee={transactionDetails?.feeAmount}
              />
            </div>
          )}
          
          {/* Navigation to profile page */}
          <div className="mt-lg text-center">
            <button
              onClick={() => router.push('/profile')}
              className="text-primary hover:underline"
            >
              View Your Profile & Transaction History
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
