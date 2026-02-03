import React, { useState, useEffect } from 'react';
import { ProductFilter, PricingAdjustment, AdjustmentType, AdjustmentIncrement, PricingProfile } from '../types';
import { ProductFilters } from './ProductFilters';
import { ProductTable } from './ProductTable';
import { PricingAdjustmentForm } from './PricingAdjustmentForm';
import { ActionButtons } from './ActionButtons';
import { StatsPanel } from './StatsPanel';
import { SavedProfiles } from './SavedProfiles';
import { ProfileDetailsModal } from './ProfileDetailModal';
import { useProducts } from '../hooks/useProducts';
import { usePricingProfile } from '../hooks/usePricingProfile';
import { useMetadata } from '../hooks/useMetadata';

export const PricingWorkflow: React.FC = () => {
  // Custom hooks
  const { products, filterProducts } = useProducts();
  const { brands, subCategories, segments } = useMetadata();
  const {
    calculatedPrices,
    savedProfiles,
    loading,
    error: pricingError,
    calculatePrices,
    saveProfile,
    loadProfiles,
    deleteProfile,
    resetCalculations,
    clearError,
  } = usePricingProfile();

  // Local state
  const [filter, setFilter] = useState<ProductFilter>({});
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [basedOnProfile, setBasedOnProfile] = useState<string>('global');
  const [adjustment, setAdjustment] = useState<PricingAdjustment>({
    adjustmentType: AdjustmentType.Fixed,
    adjustmentIncrement: AdjustmentIncrement.Increase,
    value: 0,
  });
  const [profileName, setProfileName] = useState('');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<PricingProfile | null>(null);

  // Load saved profiles on mount
  useEffect(() => {
    loadProfiles();
  }, []);

  // Update filtered products when filter or products change
  useEffect(() => {
    const filtered = filterProducts(filter);
    setFilteredProducts(filtered);
  }, [filter, products]);

  const handleCalculatePrices = async () => {
    const success = await calculatePrices(selectedProductIds, basedOnProfile, adjustment);
    if (success) {
      clearError();
    }
  };

  const handleSaveProfile = async () => {
    const savedProfile = await saveProfile(profileName, basedOnProfile, calculatedPrices);
    
    if (savedProfile) {
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
      
      // Reset form
      setProfileName('');
      setSelectedProductIds([]);
      resetCalculations();
      setAdjustment({
        adjustmentType: AdjustmentType.Fixed,
        adjustmentIncrement: AdjustmentIncrement.Increase,
        value: 0,
      });
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    await deleteProfile(profileId);
  };

  const handleViewProfile = (profile: PricingProfile) => {
    setSelectedProfile(profile);
  };

  const handleCloseModal = () => {
    setSelectedProfile(null);
  };

  // Create a map of product IDs to titles for the modal
  const productTitlesMap = new Map(
    products.map(p => [p.id, p.title])
  );

  return (
    <>
      {/* Success Message */}
      {showSaveSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">✓ Pricing profile saved successfully!</p>
        </div>
      )}

      {/* Error Message */}
      {pricingError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{pricingError}</p>
        </div>
      )}

      {/* Filters */}
      <ProductFilters
        filter={filter}
        onFilterChange={setFilter}
        brands={brands}
        subCategories={subCategories}
        segments={segments}
      />

      {/* Adjustment Settings */}
      <PricingAdjustmentForm
        adjustment={adjustment}
        onAdjustmentChange={setAdjustment}
        basedOnProfile={basedOnProfile}
        onBasedOnProfileChange={setBasedOnProfile}
      />

      {/* Action Buttons */}
      <ActionButtons
        onCalculate={handleCalculatePrices}
        onSave={handleSaveProfile}
        loading={loading}
        selectedCount={selectedProductIds.length}
        showSaveSection={calculatedPrices.length > 0}
        profileName={profileName}
        onProfileNameChange={setProfileName}
      />

      {/* Products Table */}
      <ProductTable
        products={filteredProducts}
        selectedProductIds={selectedProductIds}
        onSelectionChange={setSelectedProductIds}
        calculatedPrices={calculatedPrices}
      />

      {/* Stats */}
      <StatsPanel
        totalProducts={products.length}
        selectedProducts={selectedProductIds.length}
        calculatedPrices={calculatedPrices.length}
      />

      {/* Saved Profiles */}
      <SavedProfiles
        profiles={savedProfiles}
        onDelete={handleDeleteProfile}
        onView={handleViewProfile}
        loading={loading}
      />

      {/* Profile Details Modal */}
      <ProfileDetailsModal
        profile={selectedProfile}
        onClose={handleCloseModal}
        productTitles={productTitlesMap}
      />
    </>
  );
};