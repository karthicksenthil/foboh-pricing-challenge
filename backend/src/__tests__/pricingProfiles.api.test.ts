import request from 'supertest';
import express from 'express';
import pricingProfilesRouter from '../routes/pricingProfiles';
import { AdjustmentType, AdjustmentIncrement } from '../types';

const app = express();
app.use(express.json());
app.use('/api/pricing-profiles', pricingProfilesRouter);

describe('Pricing Profiles API', () => {
  describe('GET /api/pricing-profiles', () => {
    it('should return all pricing profiles', async () => {
      const response = await request(app)
        .get('/api/pricing-profiles')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/pricing-profiles', () => {
    it('should create a new pricing profile', async () => {
      const newProfile = {
        name: 'Test Profile',
        description: 'Test description',
        basedOnProfile: 'global',
        productPricings: [
          {
            productId: '1',
            basedOnPrice: 100,
            adjustment: {
              adjustmentType: AdjustmentType.Fixed,
              adjustmentIncrement: AdjustmentIncrement.Increase,
              value: 10,
            },
            newPrice: 110,
          },
        ],
      };

      const response = await request(app)
        .post('/api/pricing-profiles')
        .send(newProfile)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newProfile.name);
      expect(response.body.productPricings).toHaveLength(1);
    });

    it('should return 400 when missing required fields', async () => {
      const invalidProfile = {
        name: 'Test Profile',
        // missing basedOnProfile and productPricings
      };

      const response = await request(app)
        .post('/api/pricing-profiles')
        .send(invalidProfile)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/pricing-profiles/:id', () => {
    it('should return a pricing profile by id', async () => {
      // First create a profile
      const createResponse = await request(app)
        .post('/api/pricing-profiles')
        .send({
          name: 'Test Profile',
          basedOnProfile: 'global',
          productPricings: [],
        });

      const profileId = createResponse.body.id;

      // Get it by id
      const response = await request(app)
        .get(`/api/pricing-profiles/${profileId}`)
        .expect(200);

      expect(response.body.id).toBe(profileId);
      expect(response.body.name).toBe('Test Profile');
    });

    it('should return 404 for non-existent profile', async () => {
      await request(app)
        .get('/api/pricing-profiles/999')
        .expect(404);
    });
  });

  describe('PUT /api/pricing-profiles/:id', () => {
    it('should update a pricing profile', async () => {
      // Create a profile
      const createResponse = await request(app)
        .post('/api/pricing-profiles')
        .send({
          name: 'Original Name',
          basedOnProfile: 'global',
          productPricings: [],
        });

      const profileId = createResponse.body.id;

      // Update it
      const response = await request(app)
        .put(`/api/pricing-profiles/${profileId}`)
        .send({ name: 'Updated Name' })
        .expect(200);

      expect(response.body.name).toBe('Updated Name');
      expect(response.body.updatedAt).toBeDefined();
    });

    it('should return 404 for non-existent profile', async () => {
      await request(app)
        .put('/api/pricing-profiles/999')
        .send({ name: 'Updated' })
        .expect(404);
    });
  });

  describe('DELETE /api/pricing-profiles/:id', () => {
    it('should delete a pricing profile', async () => {
      // Create a profile
      const createResponse = await request(app)
        .post('/api/pricing-profiles')
        .send({
          name: 'To Delete',
          basedOnProfile: 'global',
          productPricings: [],
        });

      const profileId = createResponse.body.id;

      // Delete it
      await request(app)
        .delete(`/api/pricing-profiles/${profileId}`)
        .expect(204);

      // Verify it's gone
      await request(app)
        .get(`/api/pricing-profiles/${profileId}`)
        .expect(404);
    });
  });

  describe('POST /api/pricing-profiles/calculate', () => {
    it('should calculate prices for selected products', async () => {
      const calculateRequest = {
        productIds: ['1', '2'],
        basedOnProfile: 'global',
        adjustment: {
          adjustmentType: AdjustmentType.Fixed,
          adjustmentIncrement: AdjustmentIncrement.Increase,
          value: 20,
        },
      };

      const response = await request(app)
        .post('/api/pricing-profiles/calculate')
        .send(calculateRequest)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      
      response.body.forEach((pricing: any) => {
        expect(pricing).toHaveProperty('productId');
        expect(pricing).toHaveProperty('basedOnPrice');
        expect(pricing).toHaveProperty('newPrice');
        expect(pricing.newPrice).toBe(pricing.basedOnPrice + 20);
      });
    });

    it('should calculate percentage decrease correctly', async () => {
      const calculateRequest = {
        productIds: ['1'],
        basedOnProfile: 'global',
        adjustment: {
          adjustmentType: AdjustmentType.Dynamic,
          adjustmentIncrement: AdjustmentIncrement.Decrease,
          value: 10,
        },
      };

      const response = await request(app)
        .post('/api/pricing-profiles/calculate')
        .send(calculateRequest)
        .expect(200);

      expect(response.body).toHaveLength(1);
      const pricing = response.body[0];
      
      const expectedPrice = pricing.basedOnPrice * 0.9;
      expect(pricing.newPrice).toBeCloseTo(expectedPrice, 2);
    });

    it('should return 400 when productIds is not an array', async () => {
      const response = await request(app)
        .post('/api/pricing-profiles/calculate')
        .send({
          productIds: 'not-an-array',
          adjustment: {},
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when adjustment is missing', async () => {
      const response = await request(app)
        .post('/api/pricing-profiles/calculate')
        .send({
          productIds: ['1'],
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});