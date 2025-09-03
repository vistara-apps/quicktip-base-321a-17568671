'use client';

import { useState } from 'react';
import TipButton from './TipButton';
import NumericInput from './NumericInput';

const DEFAULT_AMOUNTS = [1, 5, 10, 25, 50, 100];

export default function TipSelector({ onSelectAmount, customAmountEnabled = true }) {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  // Handle amount selection
  const handleSelectAmount = (amount) => {
    setSelectedAmount(amount);
    setIsCustom(false);
    onSelectAmount(amount);
  };

  // Handle custom amount input
  const handleCustomAmountChange = (value) => {
    setCustomAmount(value);
    setIsCustom(true);
    
    // If valid amount, update selected amount
    if (value && !isNaN(value) && parseFloat(value) > 0) {
      setSelectedAmount(parseFloat(value));
      onSelectAmount(parseFloat(value));
    } else {
      setSelectedAmount(null);
    }
  };

  // Handle custom amount submission
  const handleCustomAmountSubmit = () => {
    if (customAmount && !isNaN(customAmount) && parseFloat(customAmount) > 0) {
      const amount = parseFloat(customAmount);
      setSelectedAmount(amount);
      onSelectAmount(amount);
    }
  };

  return (
    <div>
      <h2 className="text-body font-bold mb-sm">Select Tip Amount</h2>
      
      {/* Tiered amounts */}
      <div className="grid grid-cols-3 gap-sm mb-md">
        {DEFAULT_AMOUNTS.map((amount) => (
          <TipButton
            key={amount}
            amount={amount}
            onClick={() => handleSelectAmount(amount)}
            isSelected={selectedAmount === amount && !isCustom}
          />
        ))}
      </div>
      
      {/* Custom amount input */}
      {customAmountEnabled && (
        <div>
          <h3 className="text-sm text-gray-400 mb-sm">Or enter custom amount:</h3>
          <NumericInput
            value={customAmount}
            onChange={handleCustomAmountChange}
            onSend={handleCustomAmountSubmit}
            placeholder="Enter custom amount"
          />
        </div>
      )}
      
      {/* Selected amount display */}
      {selectedAmount && (
        <div className="mt-md p-sm bg-surface rounded-md">
          <p className="text-sm text-gray-400">Selected amount:</p>
          <p className="text-body font-bold">${selectedAmount.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

