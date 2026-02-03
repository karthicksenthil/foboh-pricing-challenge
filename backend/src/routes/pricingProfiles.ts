import { Router, Request, Response } from 'express';
import { dataStore } from '../store';
import { PricingProfile, ProductPricing } from '../types';
import { calculatePrice } from '../utils/priceCalculator';

const router = Router();

/**
 * @swagger
 * /api/pricing-profiles:
 *   get:
 *     summary: Get all pricing profiles
 *     tags: [Pricing Profiles]
 *     responses:
 *       200:
 *         description: List of pricing profiles
 */
router.get('/', (req: Request, res: Response) => {
  const profiles = dataStore.getAllPricingProfiles();
  res.json(profiles);
});

/**
 * @swagger
 * /api/pricing-profiles/{id}:
 *   get:
 *     summary: Get pricing profile by ID
 *     tags: [Pricing Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pricing profile details
 *       404:
 *         description: Pricing profile not found
 */
router.get('/:id', (req: Request, res: Response) => {
  const profile = dataStore.getPricingProfileById(req.params.id);
  if (!profile) {
    return res.status(404).json({ error: 'Pricing profile not found' });
  }
  res.json(profile);
});

/**
 * @swagger
 * /api/pricing-profiles:
 *   post:
 *     summary: Create a new pricing profile
 *     tags: [Pricing Profiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - basedOnProfile
 *               - productPricings
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               basedOnProfile:
 *                 type: string
 *               productPricings:
 *                 type: array
 *     responses:
 *       201:
 *         description: Pricing profile created
 *       400:
 *         description: Invalid input
 */
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, description, basedOnProfile, productPricings } = req.body;

    if (!name || !basedOnProfile || !productPricings) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, basedOnProfile, productPricings' 
      });
    }

    const profile: PricingProfile = {
      id: Date.now().toString(),
      name,
      description,
      basedOnProfile,
      productPricings,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const created = dataStore.createPricingProfile(profile);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

/**
 * @swagger
 * /api/pricing-profiles/{id}:
 *   put:
 *     summary: Update a pricing profile
 *     tags: [Pricing Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Pricing profile updated
 *       404:
 *         description: Pricing profile not found
 */
router.put('/:id', (req: Request, res: Response) => {
  const updated = dataStore.updatePricingProfile(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Pricing profile not found' });
  }
  res.json(updated);
});

/**
 * @swagger
 * /api/pricing-profiles/{id}:
 *   delete:
 *     summary: Delete a pricing profile
 *     tags: [Pricing Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Pricing profile deleted
 *       404:
 *         description: Pricing profile not found
 */
router.delete('/:id', (req: Request, res: Response) => {
  const deleted = dataStore.deletePricingProfile(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Pricing profile not found' });
  }
  res.status(204).send();
});

/**
 * @swagger
 * /api/pricing-profiles/calculate:
 *   post:
 *     summary: Calculate adjusted prices for products
 *     tags: [Pricing Profiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productIds
 *               - adjustment
 *             properties:
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               basedOnProfile:
 *                 type: string
 *               adjustment:
 *                 type: object
 *     responses:
 *       200:
 *         description: Calculated prices
 *       400:
 *         description: Invalid input
 */
router.post('/calculate', (req: Request, res: Response) => {
  try {
    const { productIds, basedOnProfile = 'global', adjustment } = req.body;

    if (!productIds || !Array.isArray(productIds)) {
      return res.status(400).json({ error: 'productIds must be an array' });
    }

    if (!adjustment) {
      return res.status(400).json({ error: 'adjustment is required' });
    }

    const products = dataStore.getProductsByIds(productIds);
    const productPricings: ProductPricing[] = products.map(product => {
      // For now, we only support "global" as basedOnProfile
      // In a real app, we'd look up prices from the referenced profile
      const basedOnPrice = product.globalWholesalePrice;
      const newPrice = calculatePrice(basedOnPrice, adjustment);

      return {
        productId: product.id,
        basedOnPrice,
        adjustment,
        newPrice,
      };
    });

    res.json(productPricings);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;