import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FOBOH Pricing API',
      version: '1.0.0',
      description: 'API for managing product pricing profiles',
      contact: {
        name: 'FOBOH Engineering',
        email: 'info@foboh.com.au',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Products',
        description: 'Product management endpoints',
      },
      {
        name: 'Pricing Profiles',
        description: 'Pricing profile management endpoints',
      },
      {
        name: 'Metadata',
        description: 'Metadata endpoints for filters',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);