import { AdjustmentType, AdjustmentIncrement, PricingAdjustment } from '../types';

/**
 * Calculate new price based on adjustment settings
 * @param basedOnPrice - The base price to adjust from
 * @param adjustment - The adjustment configuration
 * @returns The calculated new price (minimum 0)
 */
export function calculatePrice(
  basedOnPrice: number,
  adjustment: PricingAdjustment
): number {
  const { adjustmentType, adjustmentIncrement, value } = adjustment;

  let newPrice: number;

  if (adjustmentType === AdjustmentType.Fixed) {
    // Fixed dollar amount adjustment
    if (adjustmentIncrement === AdjustmentIncrement.Increase) {
      newPrice = basedOnPrice + value;
    } else {
      newPrice = basedOnPrice - value;
    }
  } else {
    // Dynamic percentage adjustment
    const adjustmentAmount = (value / 100) * basedOnPrice;
    if (adjustmentIncrement === AdjustmentIncrement.Increase) {
      newPrice = basedOnPrice + adjustmentAmount;
    } else {
      newPrice = basedOnPrice - adjustmentAmount;
    }
  }

  // Ensure price doesn't go negative
  return Math.max(0, Math.round(newPrice * 100) / 100);
}

/**
 * Validate adjustment to prevent invalid pricing
 * @param basedOnPrice - The base price
 * @param adjustment - The adjustment configuration
 * @returns true if valid, throws error if invalid
 */
export function validateAdjustment(
  basedOnPrice: number,
  adjustment: PricingAdjustment
): boolean {
  const { adjustmentType, value } = adjustment;

  if (basedOnPrice < 0) {
    throw new Error('Based on price cannot be negative');
  }

  if (value < 0) {
    throw new Error('Adjustment value cannot be negative');
  }

  if (adjustmentType === AdjustmentType.Dynamic && adjustment.value > 100) {
    throw new Error('Percentage adjustment cannot exceed 100%');
  }

  // Check if decrease would result in negative price
  const calculatedPrice = calculatePrice(basedOnPrice, adjustment);
  if (calculatedPrice < 0) {
    throw new Error('Adjustment would result in negative price');
  }

  return true;
}