import express from 'express';
import path from 'path';
import cors from './config/cors';
import { setHeaders } from './rest/middlewares/headers';
import { hateoas } from './rest/middlewares/hateoas';
import cheesesRoutes from './rest/routes/cheeses.routes';
import reviewsRoutes from './rest/routes/reviews.routes';
import manufacturersRoutes from './rest/routes/manufacturers.routes';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';

async function startServer() {
  const app = express();
  const port = 3000;

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  app.use('/docs', express.static(path.join(__dirname, '../docs')));

  app.use(cors);
  app.use(express.json());
  app.use(setHeaders);

  app.use('/cheeses', cheesesRoutes);
  app.use('/reviews', reviewsRoutes);
  app.use('/manufacturers', manufacturersRoutes);

  app.use(hateoas);
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  const graphqlServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await graphqlServer.start();
  graphqlServer.applyMiddleware({ app });

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(
      `GraphQL server is running at http://localhost:${port}${graphqlServer.graphqlPath}`
    );
  });
}

startServer().catch((error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});
