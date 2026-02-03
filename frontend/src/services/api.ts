import axios from 'axios';
import { Product, ProductFilter, PricingProfile, ProductPricing, PricingAdjustment } from '../types';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productApi = {
  getAll: (filter?: ProductFilter) => 
    apiClient.get<Product[]>('/products', { params: filter }),
  
  getById: (id: string) => 
    apiClient.get<Product>(`/products/${id}`),
};

export const pricingProfileApi = {
  getAll: () => 
    apiClient.get<PricingProfile[]>('/pricing-profiles'),
  
  getById: (id: string) => 
    apiClient.get<PricingProfile>(`/pricing-profiles/${id}`),
  
  create: (profile: Omit<PricingProfile, 'id' | 'createdAt' | 'updatedAt'>) => 
    apiClient.post<PricingProfile>('/pricing-profiles', profile),
  
  update: (id: string, profile: Partial<PricingProfile>) => 
    apiClient.put<PricingProfile>(`/pricing-profiles/${id}`, profile),
  
  delete: (id: string) => 
    apiClient.delete(`/pricing-profiles/${id}`),
  
  calculate: (productIds: string[], basedOnProfile: string, adjustment: PricingAdjustment) =>
    apiClient.post<ProductPricing[]>('/pricing-profiles/calculate', {
      productIds,
      basedOnProfile,
      adjustment,
    }),
};

export const metadataApi = {
  getBrands: () => 
    apiClient.get<string[]>('/metadata/brands'),
  
  getCategories: () => 
    apiClient.get<string[]>('/metadata/categories'),
  
  getSubCategories: () => 
    apiClient.get<string[]>('/metadata/sub-categories'),
  
  getSegments: () => 
    apiClient.get<string[]>('/metadata/segments'),
};