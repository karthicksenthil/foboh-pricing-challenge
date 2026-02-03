import React from 'react';
import { PricingProfile } from '../types';
import { formatCurrency } from '../utils/priceCalculator';

interface ProfileDetailsModalProps {
  profile: PricingProfile | null;
  onClose: () => void;
  productTitles: Map<string, string>;
}

export const ProfileDetailsModal: React.FC<ProfileDetailsModalProps> = ({
  profile,
  onClose,
  productTitles,
}) => {
  if (!profile) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
            {profile.description && (
              <p className="text-sm text-gray-600 mt-1">{profile.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Profile Info */}
          <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-500">Profile ID</div>
              <div className="text-sm font-medium text-gray-900">{profile.id}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Based On</div>
              <div className="text-sm font-medium text-gray-900">
                {profile.basedOnProfile === 'global' ? 'Global Wholesale' : profile.basedOnProfile}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Products</div>
              <div className="text-sm font-medium text-gray-900">
                {profile.productPricings.length}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Created</div>
              <div className="text-sm font-medium text-gray-900">
                {new Date(profile.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Product Pricings Table */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Pricing Details</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Original Price
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Adjustment
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      New Price
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Change
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {profile.productPricings.map((pricing) => {
                    const change = pricing.newPrice - pricing.basedOnPrice;
                    const changePercent = ((change / pricing.basedOnPrice) * 100).toFixed(1);
                    const isIncrease = change > 0;

                    return (
                      <tr key={pricing.productId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {productTitles.get(pricing.productId) || `Product ${pricing.productId}`}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">
                          {formatCurrency(pricing.basedOnPrice)}
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            isIncrease ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {pricing.adjustment.adjustmentIncrement === 'Increase' ? '+' : '-'}
                            {pricing.adjustment.adjustmentType === 'Fixed'
                              ? formatCurrency(pricing.adjustment.value)
                              : `${pricing.adjustment.value}%`
                            }
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                          {formatCurrency(pricing.newPrice)}
                        </td>
                        <td className={`px-4 py-3 text-sm text-right font-medium ${
                          isIncrease ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {isIncrease ? '+' : ''}{formatCurrency(change)} ({changePercent}%)
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Summary Stats */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500">Total Products</div>
                <div className="text-lg font-bold text-gray-900">
                  {profile.productPricings.length}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500">Avg Original Price</div>
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(
                    profile.productPricings.reduce((sum, p) => sum + p.basedOnPrice, 0) /
                      profile.productPricings.length
                  )}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500">Avg New Price</div>
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency(
                    profile.productPricings.reduce((sum, p) => sum + p.newPrice, 0) /
                      profile.productPricings.length
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};