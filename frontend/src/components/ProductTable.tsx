import React from 'react';
import { Product, ProductPricing } from '../types';
import { formatCurrency } from '../utils/priceCalculator';

interface ProductTableProps {
  products: Product[];
  selectedProductIds: string[];
  onSelectionChange: (productIds: string[]) => void;
  calculatedPrices?: ProductPricing[];
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  selectedProductIds,
  onSelectionChange,
  calculatedPrices,
}) => {
  const handleSelectAll = () => {
    if (selectedProductIds.length === products.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(products.map(p => p.id));
    }
  };

  const handleSelectProduct = (productId: string) => {
    if (selectedProductIds.includes(productId)) {
      onSelectionChange(selectedProductIds.filter(id => id !== productId));
    } else {
      onSelectionChange([...selectedProductIds, productId]);
    }
  };

  const getPricingForProduct = (productId: string): ProductPricing | undefined => {
    return calculatedPrices?.find(cp => cp.productId === productId);
  };

  const allSelected = products.length > 0 && selectedProductIds.length === products.length;
  const someSelected = selectedProductIds.length > 0 && !allSelected;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-6 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected;
                  }}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Brand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Segment
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Based On Price
              </th>
              {calculatedPrices && calculatedPrices.length > 0 && (
                <>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adjustment
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    New Price
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={calculatedPrices ? 8 : 6} className="px-6 py-12 text-center text-gray-500">
                  No products found. Try adjusting your filters.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const pricing = getPricingForProduct(product.id);
                const isSelected = selectedProductIds.includes(product.id);
                
                return (
                  <tr 
                    key={product.id}
                    className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectProduct(product.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{product.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{product.skuCode}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{product.brand}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                        {product.segmentId || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(product.globalWholesalePrice)}
                      </div>
                    </td>
                    {calculatedPrices && calculatedPrices.length > 0 && (
                      <>
                        <td className="px-6 py-4 text-right">
                          {pricing && (
                            <div className="text-sm text-gray-600">
                              {pricing.adjustment.adjustmentIncrement === 'Increase' ? '+' : '-'}
                              {pricing.adjustment.adjustmentType === 'Fixed' 
                                ? formatCurrency(pricing.adjustment.value)
                                : `${pricing.adjustment.value}%`
                              }
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {pricing && (
                            <div className="text-sm font-semibold text-green-600">
                              {formatCurrency(pricing.newPrice)}
                            </div>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {products.length > 0 && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            {selectedProductIds.length} of {products.length} product(s) selected
          </div>
        </div>
      )}
    </div>
  );
};