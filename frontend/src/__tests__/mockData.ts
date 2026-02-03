import { Product, ProductPricing, AdjustmentType, AdjustmentIncrement } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'High Garden Pinot Noir 2021',
    skuCode: 'HGVPIN216',
    brand: 'High Garden',
    categoryId: 'Alcoholic Beverage',
    subCategoryId: 'Wine',
    segmentId: 'Red',
    globalWholesalePrice: 279.06,
  },
  {
    id: '2',
    title: 'Koyama Methode Brut Nature NV',
    skuCode: 'KOYBRUNV6',
    brand: 'Koyama Wines',
    categoryId: 'Alcoholic Beverage',
    subCategoryId: 'Wine',
    segmentId: 'Sparkling',
    globalWholesalePrice: 120.00,
  },
  {
    id: '3',
    title: 'Koyama Riesling 2018',
    skuCode: 'KOYNR1837',
    brand: 'Koyama Wines',
    categoryId: 'Alcoholic Beverage',
    subCategoryId: 'Wine',
    segmentId: 'Port/Dessert',
    globalWholesalePrice: 215.04,
  },
];

export const mockCalculatedPrices: ProductPricing[] = [
  {
    productId: '1',
    basedOnPrice: 279.06,
    adjustment: {
      adjustmentType: AdjustmentType.Fixed,
      adjustmentIncrement: AdjustmentIncrement.Increase,
      value: 20,
    },
    newPrice: 299.06,
  },
  {
    productId: '2',
    basedOnPrice: 120.00,
    adjustment: {
      adjustmentType: AdjustmentType.Fixed,
      adjustmentIncrement: AdjustmentIncrement.Increase,
      value: 20,
    },
    newPrice: 140.00,
  },
];

export const mockBrands = ['High Garden', 'Koyama Wines', 'Lacourte-Godbillon'];
export const mockSubCategories = ['Wine', 'Beer', 'Liquor & Spirits'];
export const mockSegments = ['Red', 'White', 'Sparkling', 'Port/Dessert'];