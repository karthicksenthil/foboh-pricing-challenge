import React from 'react';

interface AlertMessageProps {
  type: 'error' | 'success';
  message: string;
  onDismiss?: () => void;
}

export const AlertMessage: React.FC<AlertMessageProps> = ({ type, message, onDismiss }) => {
  const styles = {
    error: {
      container: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: '✕',
    },
    success: {
      container: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      icon: '✓',
    },
  };

  const style = styles[type];

  return (
    <div className={`mb-6 ${style.container} border rounded-lg p-4 flex items-center justify-between`}>
      <p className={`text-sm ${style.text}`}>
        {style.icon} {message}
      </p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`${style.text} hover:opacity-70 ml-4`}
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
};