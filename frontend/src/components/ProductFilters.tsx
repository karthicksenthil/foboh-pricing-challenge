import React from 'react';
import { ProductFilter } from '../types';

interface ProductFiltersProps {
  filter: ProductFilter;
  onFilterChange: (filter: ProductFilter) => void;
  brands: string[];
  subCategories: string[];
  segments: string[];
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filter,
  onFilterChange,
  brands,
  subCategories,
  segments,
}) => {
  const handleChange = (key: keyof ProductFilter, value: string) => {
    onFilterChange({
      ...filter,
      [key]: value || undefined,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Search & Filter Products</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Products
          </label>
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={filter.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Brand Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand
          </label>
          <select
            value={filter.brand || ''}
            onChange={(e) => handleChange('brand', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Sub-Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sub-Category
          </label>
          <select
            value={filter.subCategory || ''}
            onChange={(e) => handleChange('subCategory', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Sub-Categories</option>
            {subCategories.map((subCat) => (
              <option key={subCat} value={subCat}>
                {subCat}
              </option>
            ))}
          </select>
        </div>

        {/* Segment Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Segment
          </label>
          <select
            value={filter.segment || ''}
            onChange={(e) => handleChange('segment', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Segments</option>
            {segments.map((segment) => (
              <option key={segment} value={segment}>
                {segment}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      {(filter.search || filter.brand || filter.subCategory || filter.segment) && (
        <button
          onClick={() => onFilterChange({})}
          className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};