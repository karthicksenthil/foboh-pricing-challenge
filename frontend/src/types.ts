export interface Product {
  id: string;
  title: string;
  skuCode: string;
  brand: string;
  categoryId: string;
  subCategoryId: string;
  segmentId?: string;
  globalWholesalePrice: number;
}

export enum SubCategory {
  Wine = 'Wine',
  Beer = 'Beer',
  LiquorSpirits = 'Liquor & Spirits',
  Cider = 'Cider',
  PremixedRTD = 'Premixed & Ready-to-Drink',
  Other = 'Other'
}

export enum Segment {
  Red = 'Red',
  White = 'White',
  Rose = 'Rose',
  Orange = 'Orange',
  Sparkling = 'Sparkling',
  PortDessert = 'Port/Dessert'
}

export enum AdjustmentType {
  Fixed = 'Fixed',
  Dynamic = 'Dynamic'
}

export enum AdjustmentIncrement {
  Increase = 'Increase',
  Decrease = 'Decrease'
}

export interface PricingAdjustment {
  adjustmentType: AdjustmentType;
  adjustmentIncrement: AdjustmentIncrement;
  value: number;
}

export interface ProductPricing {
  productId: string;
  basedOnPrice: number;
  adjustment: PricingAdjustment;
  newPrice: number;
}

export interface PricingProfile {
  id: string;
  name: string;
  description?: string;
  basedOnProfile: string;
  productPricings: ProductPricing[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilter {
  search?: string;
  category?: string;
  subCategory?: SubCategory;
  segment?: Segment;
  brand?: string;
}

export enum ProductSelectionType {
  One = 'one',
  Multiple = 'multiple',
  All = 'all'
}