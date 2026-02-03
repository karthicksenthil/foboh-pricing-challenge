import { useState } from 'react';
import { PricingAdjustment, ProductPricing, PricingProfile } from '../types';
import { pricingProfileApi } from '../services/api';

export const usePricingProfile = () => {
  const [calculatedPrices, setCalculatedPrices] = useState<ProductPricing[]>([]);
  const [savedProfiles, setSavedProfiles] = useState<PricingProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculatePrices = async (
    productIds: string[],
    basedOnProfile: string,
    adjustment: PricingAdjustment
  ) => {
    if (productIds.length === 0) {
      setError('Please select at least one product');
      return false;
    }

    if (adjustment.value === 0) {
      setError('Please enter an adjustment value');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await pricingProfileApi.calculate(
        productIds,
        basedOnProfile,
        adjustment
      );
      setCalculatedPrices(response.data);
      return true;
    } catch (err) {
      setError('Failed to calculate prices');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (
    name: string,
    basedOnProfile: string,
    productPricings: ProductPricing[]
  ) => {
    if (!name.trim()) {
      setError('Please enter a profile name');
      return null;
    }

    if (productPricings.length === 0) {
      setError('Please calculate prices before saving');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await pricingProfileApi.create({
        name,
        basedOnProfile,
        productPricings,
      });
      
      // Add the newly saved profile to the list
      const newProfile = response.data;
      setSavedProfiles(prev => [...prev, newProfile]);
      
      return newProfile;
    } catch (err) {
      setError('Failed to save pricing profile');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadProfiles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await pricingProfileApi.getAll();
      setSavedProfiles(response.data);
      return true;
    } catch (err) {
      setError('Failed to load pricing profiles');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteProfile = async (profileId: string) => {
    setLoading(true);
    setError(null);

    try {
      await pricingProfileApi.delete(profileId);
      setSavedProfiles(prev => prev.filter(p => p.id !== profileId));
      return true;
    } catch (err) {
      setError('Failed to delete pricing profile');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetCalculations = () => {
    setCalculatedPrices([]);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    calculatedPrices,
    savedProfiles,
    loading,
    error,
    calculatePrices,
    saveProfile,
    loadProfiles,
    deleteProfile,
    resetCalculations,
    clearError,
  };
};