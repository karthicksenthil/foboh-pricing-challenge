import { DataStore } from '../store';
import { Product, PricingProfile, ProductFilter } from '../types';

// Create a separate DataStore instance for testing
class TestDataStore extends DataStore {
  constructor() {
    super();
  }
  
  // Reset method for testing
  reset() {
    this['products'].clear();
    this['pricingProfiles'].clear();
    this['initializeProducts']();
  }
}

describe('DataStore', () => {
  let store: TestDataStore;

  beforeEach(() => {
    store = new TestDataStore();
  });

  describe('Product Operations', () => {
    it('should initialize with seed products', () => {
      const products = store.getAllProducts();
      expect(products.length).toBeGreaterThan(0);
    });

    it('should get product by id', () => {
      const product = store.getProductById('1');
      expect(product).toBeDefined();
      expect(product?.id).toBe('1');
    });

    it('should return undefined for non-existent product', () => {
      const product = store.getProductById('999');
      expect(product).toBeUndefined();
    });

    it('should create a new product', () => {
      const newProduct: Product = {
        id: 'test-1',
        title: 'Test Wine',
        skuCode: 'TEST001',
        brand: 'Test Brand',
        categoryId: 'Alcoholic Beverage',
        subCategoryId: 'Wine',
        segmentId: 'Red',
        globalWholesalePrice: 100,
      };

      const created = store.createProduct(newProduct);
      expect(created).toEqual(newProduct);
      expect(store.getProductById('test-1')).toEqual(newProduct);
    });

    it('should update an existing product', () => {
      const updated = store.updateProduct('1', { 
        globalWholesalePrice: 300 
      });
      
      expect(updated).toBeDefined();
      expect(updated?.globalWholesalePrice).toBe(300);
    });

    it('should delete a product', () => {
      const deleted = store.deleteProduct('1');
      expect(deleted).toBe(true);
      expect(store.getProductById('1')).toBeUndefined();
    });

    it('should get products by multiple ids', () => {
      const products = store.getProductsByIds(['1', '2', '3']);
      expect(products).toHaveLength(3);
      expect(products.map(p => p.id)).toEqual(['1', '2', '3']);
    });
  });

  describe('Product Filtering', () => {
    it('should filter products by search term (title)', () => {
      const filter: ProductFilter = { search: 'Koyama' };
      const products = store.getAllProducts(filter);
      
      expect(products.length).toBeGreaterThan(0);
      products.forEach(p => {
        expect(p.title.toLowerCase()).toContain('koyama');
      });
    });

    it('should filter products by search term (SKU)', () => {
      const filter: ProductFilter = { search: 'HGVPIN' };
      const products = store.getAllProducts(filter);
      
      expect(products.length).toBeGreaterThan(0);
      products.forEach(p => {
        expect(p.skuCode.toLowerCase()).toContain('hgvpin');
      });
    });

    it('should filter products by brand', () => {
      const filter: ProductFilter = { brand: 'High Garden' };
      const products = store.getAllProducts(filter);
      
      expect(products.length).toBeGreaterThan(0);
      products.forEach(p => {
        expect(p.brand).toBe('High Garden');
      });
    });

    it('should filter products by sub-category', () => {
      const filter: ProductFilter = { subCategory: 'Wine' as any };
      const products = store.getAllProducts(filter);
      
      expect(products.length).toBeGreaterThan(0);
      products.forEach(p => {
        expect(p.subCategoryId).toBe('Wine');
      });
    });

    it('should filter products by segment', () => {
      const filter: ProductFilter = { segment: 'Sparkling' as any };
      const products = store.getAllProducts(filter);
      
      expect(products.length).toBeGreaterThan(0);
      products.forEach(p => {
        expect(p.segmentId).toBe('Sparkling');
      });
    });

    it('should apply multiple filters', () => {
      const filter: ProductFilter = { 
        brand: 'Koyama Wines',
        segment: 'Sparkling' as any 
      };
      const products = store.getAllProducts(filter);
      
      products.forEach(p => {
        expect(p.brand).toBe('Koyama Wines');
        expect(p.segmentId).toBe('Sparkling');
      });
    });

    it('should return empty array when no products match', () => {
      const filter: ProductFilter = { search: 'NonExistentProduct' };
      const products = store.getAllProducts(filter);
      expect(products).toEqual([]);
    });

    it('should be case-insensitive for search', () => {
      const filter1: ProductFilter = { search: 'KOYAMA' };
      const filter2: ProductFilter = { search: 'koyama' };
      
      const products1 = store.getAllProducts(filter1);
      const products2 = store.getAllProducts(filter2);
      
      expect(products1.length).toBe(products2.length);
    });
  });

  describe('Pricing Profile Operations', () => {
    const sampleProfile: PricingProfile = {
      id: 'profile-1',
      name: 'VIP Discount',
      description: 'Special pricing for VIP customers',
      basedOnProfile: 'global',
      productPricings: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a pricing profile', () => {
      const created = store.createPricingProfile(sampleProfile);
      expect(created).toEqual(sampleProfile);
    });

    it('should get all pricing profiles', () => {
      store.createPricingProfile(sampleProfile);
      const profiles = store.getAllPricingProfiles();
      expect(profiles).toContainEqual(sampleProfile);
    });

    it('should get pricing profile by id', () => {
      store.createPricingProfile(sampleProfile);
      const profile = store.getPricingProfileById('profile-1');
      expect(profile).toEqual(sampleProfile);
    });

    it('should update a pricing profile', () => {
      store.createPricingProfile(sampleProfile);
      const updated = store.updatePricingProfile('profile-1', {
        name: 'Updated Name',
      });
      
      expect(updated).toBeDefined();
      expect(updated?.name).toBe('Updated Name');
      expect(updated?.updatedAt).toBeInstanceOf(Date);
    });

    it('should delete a pricing profile', () => {
      store.createPricingProfile(sampleProfile);
      const deleted = store.deletePricingProfile('profile-1');
      expect(deleted).toBe(true);
      expect(store.getPricingProfileById('profile-1')).toBeUndefined();
    });
  });

  describe('Metadata Operations', () => {
    it('should get all brands', () => {
      const brands = store.getAllBrands();
      expect(brands).toContain('High Garden');
      expect(brands).toContain('Koyama Wines');
      expect(brands.length).toBeGreaterThan(0);
    });

    it('should get all categories', () => {
      const categories = store.getAllCategories();
      expect(categories).toContain('Alcoholic Beverage');
    });

    it('should get all segments', () => {
      const segments = store.getAllSegments();
      expect(segments).toContain('Red');
      expect(segments).toContain('White');
      expect(segments).toContain('Sparkling');
    });

    it('should return sorted brands', () => {
      const brands = store.getAllBrands();
      const sorted = [...brands].sort();
      expect(brands).toEqual(sorted);
    });
  });
});