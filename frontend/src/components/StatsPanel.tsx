import React from 'react';

interface StatsPanelProps {
  totalProducts: number;
  selectedProducts: number;
  calculatedPrices: number;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  totalProducts,
  selectedProducts,
  calculatedPrices,
}) => {
  const stats = [
    {
      value: totalProducts,
      label: 'Total Products',
      color: 'text-gray-900',
    },
    {
      value: selectedProducts,
      label: 'Selected Products',
      color: 'text-blue-600',
    },
    {
      value: calculatedPrices,
      label: 'Calculated Prices',
      color: 'text-green-600',
    },
  ];

  return (
    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        {stats.map((stat, index) => (
          <div key={index}>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};