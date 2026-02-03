import { Router, Request, Response } from 'express';
import { dataStore } from '../store';
import { SubCategory, Segment } from '../types';

const router = Router();

/**
 * @swagger
 * /api/metadata/brands:
 *   get:
 *     summary: Get all unique brands
 *     tags: [Metadata]
 *     responses:
 *       200:
 *         description: List of brands
 */
router.get('/brands', (req: Request, res: Response) => {
  const brands = dataStore.getAllBrands();
  res.json(brands);
});

/**
 * @swagger
 * /api/metadata/categories:
 *   get:
 *     summary: Get all unique categories
 *     tags: [Metadata]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/categories', (req: Request, res: Response) => {
  const categories = dataStore.getAllCategories();
  res.json(categories);
});

/**
 * @swagger
 * /api/metadata/sub-categories:
 *   get:
 *     summary: Get all sub-categories
 *     tags: [Metadata]
 *     responses:
 *       200:
 *         description: List of sub-categories
 */
router.get('/sub-categories', (req: Request, res: Response) => {
  const subCategories = Object.values(SubCategory);
  res.json(subCategories);
});

/**
 * @swagger
 * /api/metadata/segments:
 *   get:
 *     summary: Get all segments
 *     tags: [Metadata]
 *     responses:
 *       200:
 *         description: List of segments
 */
router.get('/segments', (req: Request, res: Response) => {
  const segments = Object.values(Segment);
  res.json(segments);
});

export default router;