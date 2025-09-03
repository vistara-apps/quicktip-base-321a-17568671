    'use client';

    export default function TipButton({ amount, onClick }) {
      return (
        <button
          onClick={onClick}
          className="bg-primary text-white font-bold py-sm px-md rounded-md hover:bg-opacity-90 transition duration-base"
        >
          ${amount}
        </button>
      );
    }
  