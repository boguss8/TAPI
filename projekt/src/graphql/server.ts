import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import typeDefs from './schema';
import { resolvers } from './resolvers';

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

server.applyMiddleware({ app });

const port = 4000;
app.listen(port, () => {
  console.log(
    `GraphQL server is running at http://localhost:${port}${server.graphqlPath}`
  );
});
