import request from 'supertest';
import express from 'express';
import productsRouter from '../routes/products';

const app = express();
app.use(express.json());
app.use('/api/products', productsRouter);

describe('Products API', () => {
  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should filter products by search term', async () => {
      const response = await request(app)
        .get('/api/products?search=Koyama')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((product: any) => {
        const matchesSearch = 
          product.title.toLowerCase().includes('koyama') ||
          product.skuCode.toLowerCase().includes('koyama');
        expect(matchesSearch).toBe(true);
      });
    });

    it('should filter products by brand', async () => {
      const response = await request(app)
        .get('/api/products?brand=High Garden')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((product: any) => {
        expect(product.brand).toBe('High Garden');
      });
    });

    it('should filter products by segment', async () => {
      const response = await request(app)
        .get('/api/products?segment=Sparkling')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((product: any) => {
        expect(product.segmentId).toBe('Sparkling');
      });
    });

    it('should return empty array when no matches found', async () => {
      const response = await request(app)
        .get('/api/products?search=NonExistentProduct')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a product by id', async () => {
      const response = await request(app)
        .get('/api/products/1')
        .expect(200);

      expect(response.body).toHaveProperty('id', '1');
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('skuCode');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const newProduct = {
        title: 'Test Wine',
        skuCode: 'TEST001',
        brand: 'Test Brand',
        categoryId: 'Alcoholic Beverage',
        subCategoryId: 'Wine',
        segmentId: 'Red',
        globalWholesalePrice: 100,
      };

      const response = await request(app)
        .post('/api/products')
        .send(newProduct)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newProduct.title);
      expect(response.body.skuCode).toBe(newProduct.skuCode);
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update an existing product', async () => {
      const updates = {
        globalWholesalePrice: 350,
      };

      const response = await request(app)
        .put('/api/products/1')
        .send(updates)
        .expect(200);

      expect(response.body.globalWholesalePrice).toBe(350);
      expect(response.body.id).toBe('1');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .put('/api/products/999')
        .send({ globalWholesalePrice: 350 })
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product', async () => {
      // First create a product to delete
      const createResponse = await request(app)
        .post('/api/products')
        .send({
          title: 'To Delete',
          skuCode: 'DEL001',
          brand: 'Test',
          categoryId: 'Test',
          subCategoryId: 'Test',
          globalWholesalePrice: 100,
        });

      const productId = createResponse.body.id;

      // Delete it
      await request(app)
        .delete(`/api/products/${productId}`)
        .expect(204);

      // Verify it's gone
      await request(app)
        .get(`/api/products/${productId}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent product', async () => {
      await request(app)
        .delete('/api/products/999')
        .expect(404);
    });
  });
});