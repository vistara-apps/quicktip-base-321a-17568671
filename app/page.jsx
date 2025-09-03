    'use client';

    import { useState } from 'react';
    import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
    import { parseUnits } from 'viem';
    import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
    import { base } from 'viem/chains';
    import ProfileCard from './components/ProfileCard';
    import TipButton from './components/TipButton';
    import NumericInput from './components/NumericInput';
    import TransactionStatusIndicator from './components/TransactionStatusIndicator';

    const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'; // USDC on Base
    const RECIPIENT_ADDRESS = '0x000000000000000000000000000000000000dead'; // Hardcoded recipient for demo
    const DECIMALS = 6;

    export default function Home() {
      const { address, isConnected } = useAccount();
      const { writeContract, data: hash, error, isPending } = useWriteContract();
      const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });
      const [customAmount, setCustomAmount] = useState('');
      const [status, setStatus] = useState(null);

      const sendTip = async (amountUSD) => {
        try {
          const amountUSDC = parseUnits(amountUSD.toString(), DECIMALS);
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
            args: [RECIPIENT_ADDRESS, amountUSDC],
            chainId: base.id,
          });
          setStatus('pending');
        } catch (err) {
          console.error('Error initiating tip:', err);
          setStatus('failed');
        }
      };

      const handleCustomSend = () => {
        if (customAmount && !isNaN(customAmount) && parseFloat(customAmount) > 0) {
          sendTip(parseFloat(customAmount));
          setCustomAmount('');
        }
      };

      // Update status based on transaction receipt
      if (hash && isConfirming) {
        setStatus('pending');
      } else if (receipt?.status === 'success') {
        setStatus('success');
      } else if (error) {
        setStatus('failed');
      }

      return (
        <div className="max-w-xl mx-auto px-4 py-8">
          <h1 className="text-display text-center mb-lg">QuickTip Base</h1>
          {!isConnected ? (
            <div className="flex justify-center">
              <Wallet>
                <ConnectWallet />
              </Wallet>
            </div>
          ) : (
            <>
              <ProfileCard address={RECIPIENT_ADDRESS} />
              <div className="grid grid-cols-3 gap-sm mt-md">
                <TipButton amount={1} onClick={() => sendTip(1)} />
                <TipButton amount={5} onClick={() => sendTip(5)} />
                <TipButton amount={10} onClick={() => sendTip(10)} />
              </div>
              <div className="mt-md">
                <NumericInput
                  value={customAmount}
                  onChange={setCustomAmount}
                  onSend={handleCustomSend}
                />
              </div>
              {status && <TransactionStatusIndicator status={status} />}
            </>
          )}
        </div>
      );
    }
  