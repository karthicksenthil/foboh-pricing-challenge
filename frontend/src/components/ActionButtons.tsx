import React from 'react';

interface ActionButtonsProps {
  onCalculate: () => void;
  onSave: () => void;
  loading: boolean;
  selectedCount: number;
  showSaveSection: boolean;
  profileName: string;
  onProfileNameChange: (name: string) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCalculate,
  onSave,
  loading,
  selectedCount,
  showSaveSection,
  profileName,
  onProfileNameChange,
}) => {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-4">
      <button
        onClick={onCalculate}
        disabled={loading || selectedCount === 0}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
      >
        {loading ? 'Calculating...' : 'Calculate Prices'}
      </button>

      {showSaveSection && (
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Profile name (e.g., VIP Discount)"
            value={profileName}
            onChange={(e) => onProfileNameChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={onSave}
            disabled={loading || !profileName.trim()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
          >
            Save Profile
          </button>
        </div>
      )}
    </div>
  );
};