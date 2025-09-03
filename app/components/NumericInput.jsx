    'use client';

    export default function NumericInput({ value, onChange, onSend }) {
      return (
        <div className="flex items-center">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Custom amount in USD"
            className="flex-1 p-sm border rounded-md text-body bg-transparent text-white border-slate-600"
            min="0.01"
            step="0.01"
          />
          <button
            onClick={onSend}
            className="ml-sm bg-accent text-white font-bold py-sm px-md rounded-md hover:bg-opacity-90 transition duration-base"
          >
            Send
          </button>
        </div>
      );
    }
  