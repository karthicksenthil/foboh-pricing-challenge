import { useState, useEffect } from 'react';
import { metadataApi } from '../services/api';

export const useMetadata = () => {
  const [brands, setBrands] = useState<string[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [segments, setSegments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetadata();
  }, []);

  const loadMetadata = async () => {
    setLoading(true);
    
    try {
      const [brandsRes, subCatsRes, segmentsRes] = await Promise.all([
        metadataApi.getBrands(),
        metadataApi.getSubCategories(),
        metadataApi.getSegments(),
      ]);
      
      setBrands(brandsRes.data);
      setSubCategories(subCatsRes.data);
      setSegments(segmentsRes.data);
    } catch (err) {
      console.error('Failed to load metadata', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    brands,
    subCategories,
    segments,
    loading,
  };
};