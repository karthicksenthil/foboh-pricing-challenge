import { Product, PricingProfile, ProductFilter } from './types';
import { seedProducts } from './data';

class DataStore {
  private products: Map<string, Product>;
  private pricingProfiles: Map<string, PricingProfile>;

  constructor() {
    this.products = new Map();
    this.pricingProfiles = new Map();
    this.initializeProducts();
  }

  private initializeProducts() {
    seedProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  // Product methods
  getAllProducts(filter?: ProductFilter): Product[] {
    let products = Array.from(this.products.values());

    if (!filter) {
      return products;
    }

    // Apply search filter (fuzzy matching on title and SKU)
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      products = products.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.skuCode.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filter.category) {
      products = products.filter(p => p.categoryId === filter.category);
    }

    // Apply sub-category filter
    if (filter.subCategory) {
      products = products.filter(p => p.subCategoryId === filter.subCategory);
    }

    // Apply segment filter
    if (filter.segment) {
      products = products.filter(p => p.segmentId === filter.segment);
    }

    // Apply brand filter
    if (filter.brand) {
      products = products.filter(p => p.brand === filter.brand);
    }

    return products;
  }

  getProductById(id: string): Product | undefined {
    return this.products.get(id);
  }

  getProductsByIds(ids: string[]): Product[] {
    return ids
      .map(id => this.products.get(id))
      .filter((p): p is Product => p !== undefined);
  }

  createProduct(product: Product): Product {
    this.products.set(product.id, product);
    return product;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const product = this.products.get(id);
    if (!product) {
      return undefined;
    }
    const updated = { ...product, ...updates, id };
    this.products.set(id, updated);
    return updated;
  }

  deleteProduct(id: string): boolean {
    return this.products.delete(id);
  }

  // Pricing Profile methods
  getAllPricingProfiles(): PricingProfile[] {
    return Array.from(this.pricingProfiles.values());
  }

  getPricingProfileById(id: string): PricingProfile | undefined {
    return this.pricingProfiles.get(id);
  }

  createPricingProfile(profile: PricingProfile): PricingProfile {
    this.pricingProfiles.set(profile.id, profile);
    return profile;
  }

  updatePricingProfile(id: string, updates: Partial<PricingProfile>): PricingProfile | undefined {
    const profile = this.pricingProfiles.get(id);
    if (!profile) {
      return undefined;
    }
    const updated = { 
      ...profile, 
      ...updates, 
      id,
      updatedAt: new Date()
    };
    this.pricingProfiles.set(id, updated);
    return updated;
  }

  deletePricingProfile(id: string): boolean {
    return this.pricingProfiles.delete(id);
  }

  // Utility methods
  getAllBrands(): string[] {
    const brands = new Set<string>();
    this.products.forEach(p => brands.add(p.brand));
    return Array.from(brands).sort();
  }

  getAllCategories(): string[] {
    const categories = new Set<string>();
    this.products.forEach(p => categories.add(p.categoryId));
    return Array.from(categories).sort();
  }

  getAllSubCategories(): string[] {
    const subCategories = new Set<string>();
    this.products.forEach(p => subCategories.add(p.subCategoryId));
    return Array.from(subCategories).sort();
  }

  getAllSegments(): string[] {
    const segments = new Set<string>();
    this.products.forEach(p => {
      if (p.segmentId) segments.add(p.segmentId);
    });
    return Array.from(segments).sort();
  }
}

export { DataStore };
export const dataStore = new DataStore();