const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cheese API',
      version: '1.0.0',
      description:
        'API for managing cheese products, manufacturers and reviews',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/rest/routes/*.routes.ts'],
};

module.exports = swaggerJsdoc(options);
