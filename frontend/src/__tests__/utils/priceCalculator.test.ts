import { describe, it, expect } from 'vitest';
import { calculatePrice, formatCurrency } from '../../utils/priceCalculator';
import { AdjustmentType, AdjustmentIncrement, PricingAdjustment } from '../../types';

describe('priceCalculator utils', () => {
  describe('calculatePrice', () => {
    it('should calculate fixed increase correctly', () => {
      const adjustment: PricingAdjustment = {
        adjustmentType: AdjustmentType.Fixed,
        adjustmentIncrement: AdjustmentIncrement.Increase,
        value: 20,
      };
      
      const result = calculatePrice(100, adjustment);
      expect(result).toBe(120);
    });

    it('should calculate fixed decrease correctly', () => {
      const adjustment: PricingAdjustment = {
        adjustmentType: AdjustmentType.Fixed,
        adjustmentIncrement: AdjustmentIncrement.Decrease,
        value: 20,
      };
      
      const result = calculatePrice(100, adjustment);
      expect(result).toBe(80);
    });

    it('should calculate dynamic increase correctly', () => {
      const adjustment: PricingAdjustment = {
        adjustmentType: AdjustmentType.Dynamic,
        adjustmentIncrement: AdjustmentIncrement.Increase,
        value: 20,
      };
      
      const result = calculatePrice(100, adjustment);
      expect(result).toBe(120);
    });

    it('should calculate dynamic decrease correctly', () => {
      const adjustment: PricingAdjustment = {
        adjustmentType: AdjustmentType.Dynamic,
        adjustmentIncrement: AdjustmentIncrement.Decrease,
        value: 20,
      };
      
      const result = calculatePrice(100, adjustment);
      expect(result).toBe(80);
    });

    it('should not return negative prices', () => {
      const adjustment: PricingAdjustment = {
        adjustmentType: AdjustmentType.Fixed,
        adjustmentIncrement: AdjustmentIncrement.Decrease,
        value: 150,
      };
      
      const result = calculatePrice(100, adjustment);
      expect(result).toBe(0);
    });

    it('should round to 2 decimal places', () => {
      const adjustment: PricingAdjustment = {
        adjustmentType: AdjustmentType.Dynamic,
        adjustmentIncrement: AdjustmentIncrement.Increase,
        value: 10,
      };
      
      const result = calculatePrice(279.06, adjustment);
      expect(result).toBe(306.97);
    });
  });

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(100)).toBe('$100.00');
      expect(formatCurrency(279.06)).toBe('$279.06');
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should handle large numbers', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    });
  });
});