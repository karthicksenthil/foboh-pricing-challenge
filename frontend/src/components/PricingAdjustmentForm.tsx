import React from 'react';
import { PricingAdjustment, AdjustmentType, AdjustmentIncrement } from '../types';

interface PricingAdjustmentFormProps {
  adjustment: PricingAdjustment;
  onAdjustmentChange: (adjustment: PricingAdjustment) => void;
  basedOnProfile: string;
  onBasedOnProfileChange: (profile: string) => void;
}

export const PricingAdjustmentForm: React.FC<PricingAdjustmentFormProps> = ({
  adjustment,
  onAdjustmentChange,
  basedOnProfile,
  onBasedOnProfileChange,
}) => {
  const handleTypeChange = (type: AdjustmentType) => {
    onAdjustmentChange({
      ...adjustment,
      adjustmentType: type,
      value: 0,
    });
  };

  const handleIncrementChange = (increment: AdjustmentIncrement) => {
    onAdjustmentChange({
      ...adjustment,
      adjustmentIncrement: increment,
    });
  };

  const handleValueChange = (value: number) => {
    onAdjustmentChange({
      ...adjustment,
      value: Math.max(0, value),
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Adjustment Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Based On Profile */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Based On
          </label>
          <select
            value={basedOnProfile}
            onChange={(e) => onBasedOnProfileChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="global">Global Wholesale Price</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Base price for calculations
          </p>
        </div>

        {/* Adjustment Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adjustment Type
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                checked={adjustment.adjustmentType === AdjustmentType.Fixed}
                onChange={() => handleTypeChange(AdjustmentType.Fixed)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Fixed ($)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={adjustment.adjustmentType === AdjustmentType.Dynamic}
                onChange={() => handleTypeChange(AdjustmentType.Dynamic)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Dynamic (%)</span>
            </label>
          </div>
        </div>

        {/* Adjustment Increment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adjustment Direction
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                checked={adjustment.adjustmentIncrement === AdjustmentIncrement.Increase}
                onChange={() => handleIncrementChange(AdjustmentIncrement.Increase)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Increase (+)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={adjustment.adjustmentIncrement === AdjustmentIncrement.Decrease}
                onChange={() => handleIncrementChange(AdjustmentIncrement.Decrease)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Decrease (-)</span>
            </label>
          </div>
        </div>

        {/* Adjustment Value */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adjustment Value
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step={adjustment.adjustmentType === AdjustmentType.Fixed ? '0.01' : '1'}
              value={adjustment.value}
              onChange={(e) => handleValueChange(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">
                {adjustment.adjustmentType === AdjustmentType.Fixed ? '$' : '%'}
              </span>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {adjustment.adjustmentType === AdjustmentType.Fixed 
              ? 'Dollar amount to adjust' 
              : 'Percentage to adjust (0-100)'}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Adjustment Summary:</strong> {adjustment.adjustmentIncrement === AdjustmentIncrement.Increase ? 'Increase' : 'Decrease'} prices by{' '}
          {adjustment.adjustmentType === AdjustmentType.Fixed 
            ? `$${adjustment.value.toFixed(2)}` 
            : `${adjustment.value}%`}
          {' '}from the {basedOnProfile === 'global' ? 'global wholesale price' : 'selected profile'}
        </p>
      </div>
    </div>
  );
};