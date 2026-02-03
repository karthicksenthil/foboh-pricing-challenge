import { AdjustmentType, AdjustmentIncrement, PricingAdjustment } from '../types';

export function calculatePrice(
  basedOnPrice: number,
  adjustment: PricingAdjustment
): number {
  const { adjustmentType, adjustmentIncrement, value } = adjustment;

  let newPrice: number;

  if (adjustmentType === AdjustmentType.Fixed) {
    if (adjustmentIncrement === AdjustmentIncrement.Increase) {
      newPrice = basedOnPrice + value;
    } else {
      newPrice = basedOnPrice - value;
    }
  } else {
    const adjustmentAmount = (value / 100) * basedOnPrice;
    if (adjustmentIncrement === AdjustmentIncrement.Increase) {
      newPrice = basedOnPrice + adjustmentAmount;
    } else {
      newPrice = basedOnPrice - adjustmentAmount;
    }
  }

  return Math.max(0, Math.round(newPrice * 100) / 100);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(amount);
}