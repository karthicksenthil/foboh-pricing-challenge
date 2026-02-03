import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import productsRouter from './routes/products';
import pricingProfilesRouter from './routes/pricingProfiles';
import metadataRouter from './routes/metadata';
import path from 'path';

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/pricing-profiles', pricingProfilesRouter);
app.use('/api/metadata', metadataRouter);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.static(path.join(__dirname, 'dist')));
// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
// app.get('/', (req: Request, res: Response) => {
//   res.json({
//     message: 'FOBOH Pricing API',
//     version: '1.0.0',
//     documentation: '/api-docs',
//     endpoints: {
//       products: '/api/products',
//       pricingProfiles: '/api/pricing-profiles',
//       metadata: '/api/metadata',
//     },
//   });
// });

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

export default app;