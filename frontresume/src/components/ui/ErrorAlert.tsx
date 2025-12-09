import React from 'react';

interface ErrorAlertProps {
  message: string;
  onClose?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onClose }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg relative" role="alert">
      <div className="flex items-start">
        <span className="text-xl mr-2">⚠️</span>
        <div className="flex-1">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{message}</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-red-800 hover:text-red-900"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
