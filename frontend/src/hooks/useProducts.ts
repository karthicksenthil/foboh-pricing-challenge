import { useState, useEffect } from 'react';
import { Product, ProductFilter } from '../types';
import { productApi } from '../services/api';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productApi.getAll();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = (filter: ProductFilter): Product[] => {
    let result = [...products];

    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(searchLower) ||
          p.skuCode.toLowerCase().includes(searchLower)
      );
    }

    if (filter.brand) {
      result = result.filter(p => p.brand === filter.brand);
    }

    if (filter.subCategory) {
      result = result.filter(p => p.subCategoryId === filter.subCategory);
    }

    if (filter.segment) {
      result = result.filter(p => p.segmentId === filter.segment);
    }

    return result;
  };

  return {
    products,
    loading,
    error,
    filterProducts,
    reload: loadProducts,
  };
};