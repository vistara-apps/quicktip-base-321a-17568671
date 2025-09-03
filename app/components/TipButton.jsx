'use client';

export default function TipButton({ amount, onClick, variant = 'primary', isSelected = false }) {
  // Determine button style based on variant and selection state
  const getButtonStyle = () => {
    if (isSelected) {
      return 'bg-accent text-white';
    }
    
    switch (variant) {
      case 'primary':
        return 'bg-primary text-white';
      case 'secondary':
        return 'bg-surface text-white';
      case 'accent':
        return 'bg-accent text-white';
      default:
        return 'bg-primary text-white';
    }
  };
  
  return (
    <button
      onClick={onClick}
      className={`${getButtonStyle()} font-bold py-sm px-md rounded-md hover:bg-opacity-90 transition duration-base flex items-center justify-center`}
    >
      {isSelected && <span className="mr-1">✓</span>}
      ${amount}
    </button>
  );
}
