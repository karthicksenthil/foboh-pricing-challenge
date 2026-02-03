import React from 'react';
import { PricingProfile } from '../types';
import { formatCurrency } from '../utils/priceCalculator';

interface SavedProfilesProps {
  profiles: PricingProfile[];
  onDelete: (profileId: string) => void;
  onView: (profile: PricingProfile) => void;
  loading?: boolean;
}

export const SavedProfiles: React.FC<SavedProfilesProps> = ({
  profiles,
  onDelete,
  onView,
  loading = false,
}) => {
  if (profiles.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Saved Pricing Profiles ({profiles.length})
      </h3>

      <div className="space-y-3">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{profile.name}</h4>
                {profile.description && (
                  <p className="text-sm text-gray-600 mt-1">{profile.description}</p>
                )}
                
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                  <span>
                    <strong>{profile.productPricings.length}</strong> products
                  </span>
                  <span>
                    Based on: <strong>{profile.basedOnProfile === 'global' ? 'Global Price' : profile.basedOnProfile}</strong>
                  </span>
                  <span>
                    Created: {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Show sample of product pricings */}
                {profile.productPricings.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs text-gray-500 mb-1">Sample pricing:</div>
                    <div className="flex gap-3 text-sm">
                      {profile.productPricings.slice(0, 3).map((pricing) => (
                        <div key={pricing.productId} className="flex items-center gap-2">
                          <span className="text-gray-600">
                            {formatCurrency(pricing.basedOnPrice)}
                          </span>
                          <span className="text-gray-400">→</span>
                          <span className="text-green-600 font-medium">
                            {formatCurrency(pricing.newPrice)}
                          </span>
                        </div>
                      ))}
                      {profile.productPricings.length > 3 && (
                        <span className="text-gray-400 text-xs">
                          +{profile.productPricings.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => onView(profile)}
                  className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  disabled={loading}
                >
                  View Details
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete "${profile.name}"?`)) {
                      onDelete(profile.id);
                    }
                  }}
                  className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};