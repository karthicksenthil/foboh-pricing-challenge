import { calculatePrice, validateAdjustment } from '../utils/priceCalculator';
import { AdjustmentType, AdjustmentIncrement, PricingAdjustment } from '../types';

describe('Price Calculator', () => {
  describe('calculatePrice', () => {
    describe('Fixed Adjustments', () => {
      it('should increase price by fixed amount', () => {
        const adjustment: PricingAdjustment = {
          adjustmentType: AdjustmentType.Fixed,
          adjustmentIncrement: AdjustmentIncrement.Increase,
          value: 20,
        };
        
        const result = calculatePrice(100, adjustment);
        expect(result).toBe(120);
      });

      it('should decrease price by fixed amount', () => {
        const adjustment: PricingAdjustment = {
          adjustmentType: AdjustmentType.Fixed,
          adjustmentIncrement: AdjustmentIncrement.Decrease,
          value: 20,
        };
        
        const result = calculatePrice(100, adjustment);
        expect(result).toBe(80);
      });

      it('should handle decimal amounts correctly', () => {
        const adjustment: PricingAdjustment = {
          adjustmentType: AdjustmentType.Fixed,
          adjustmentIncrement: AdjustmentIncrement.Increase,
          value: 15.99,
        };
        
        const result = calculatePrice(100.50, adjustment);
        expect(result).toBe(116.49);
      });
    });

    describe('Dynamic (Percentage) Adjustments', () => {
      it('should increase price by percentage', () => {
        const adjustment: PricingAdjustment = {
          adjustmentType: AdjustmentType.Dynamic,
          adjustmentIncrement: AdjustmentIncrement.Increase,
          value: 20,
        };
        
        const result = calculatePrice(100, adjustment);
        expect(result).toBe(120);
      });

      it('should decrease price by percentage', () => {
        const adjustment: PricingAdjustment = {
          adjustmentType: AdjustmentType.Dynamic,
          adjustmentIncrement: AdjustmentIncrement.Decrease,
          value: 20,
        };
        
        const result = calculatePrice(100, adjustment);
        expect(result).toBe(80);
      });

      it('should handle percentage with decimals', () => {
        const adjustment: PricingAdjustment = {
          adjustmentType: AdjustmentType.Dynamic,
          adjustmentIncrement: AdjustmentIncrement.Increase,
          value: 10,
        };
        
        const result = calculatePrice(279.06, adjustment);
        expect(result).toBe(306.97);
      });

      it('should calculate 50% decrease correctly', () => {
        const adjustment: PricingAdjustment = {
          adjustmentType: AdjustmentType.Dynamic,
          adjustmentIncrement: AdjustmentIncrement.Decrease,
          value: 50,
        };
        
        const result = calculatePrice(200, adjustment);
        expect(result).toBe(100);
      });
    });

    describe('Edge Cases', () => {
      it('should not return negative prices', () => {
        const adjustment: PricingAdjustment = {
          adjustmentType: AdjustmentType.Fixed,
          adjustmentIncrement: AdjustmentIncrement.Decrease,
          value: 150,
        };
        
        const result = calculatePrice(100, adjustment);
        expect(result).toBe(0);
      });

      it('should handle zero base price', () => {
        const adjustment: PricingAdjustment = {
          adjustmentType: AdjustmentType.Fixed,
          adjustmentIncrement: AdjustmentIncrement.Increase,
          value: 50,
        };
        
        const result = calculatePrice(0, adjustment);
        expect(result).toBe(50);
      });

      it('should handle zero adjustment value', () => {
        const adjustment: PricingAdjustment = {
          adjustmentType: AdjustmentType.Fixed,
          adjustmentIncrement: AdjustmentIncrement.Increase,
          value: 0,
        };
        
        const result = calculatePrice(100, adjustment);
        expect(result).toBe(100);
      });

      it('should round to 2 decimal places', () => {
        const adjustment: PricingAdjustment = {
          adjustmentType: AdjustmentType.Dynamic,
          adjustmentIncrement: AdjustmentIncrement.Increase,
          value: 33.333,
        };
        
        const result = calculatePrice(100, adjustment);
        expect(result).toBe(133.33);
      });
    });
  });

  describe('validateAdjustment', () => {
    it('should validate correct adjustments', () => {
      const adjustment: PricingAdjustment = {
        adjustmentType: AdjustmentType.Fixed,
        adjustmentIncrement: AdjustmentIncrement.Increase,
        value: 10,
      };
      
      expect(() => validateAdjustment(100, adjustment)).not.toThrow();
    });

    it('should throw error for negative base price', () => {
      const adjustment: PricingAdjustment = {
        adjustmentType: AdjustmentType.Fixed,
        adjustmentIncrement: AdjustmentIncrement.Increase,
        value: 10,
      };
      
      expect(() => validateAdjustment(-100, adjustment)).toThrow('Based on price cannot be negative');
    });

    it('should throw error for negative adjustment value', () => {
      const adjustment: PricingAdjustment = {
        adjustmentType: AdjustmentType.Fixed,
        adjustmentIncrement: AdjustmentIncrement.Increase,
        value: -10,
      };
      
      expect(() => validateAdjustment(100, adjustment)).toThrow('Adjustment value cannot be negative');
    });

    it('should throw error for percentage over 100', () => {
      const adjustment: PricingAdjustment = {
        adjustmentType: AdjustmentType.Dynamic,
        adjustmentIncrement: AdjustmentIncrement.Increase,
        value: 150,
      };
      
      expect(() => validateAdjustment(100, adjustment)).toThrow('Percentage adjustment cannot exceed 100%');
    });
  });
});