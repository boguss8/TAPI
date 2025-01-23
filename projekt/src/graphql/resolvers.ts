import { reviews, cheeses } from '../data';
import { Review } from '../rest/models/review.model';
import { Cheese } from '../rest/models/cheese.model';
import { cheeseResolvers } from './resolvers/cheese.resolver';
import { manufacturerResolvers } from './resolvers/manufacturer.resolver';
import { reviewResolvers } from './resolvers/review.resolver';

export const resolvers = {
  Query: {
    ...manufacturerResolvers.Query,
    ...reviewResolvers.Query,
    ...cheeseResolvers.Query,
  },
  Mutation: {
    ...manufacturerResolvers.Mutation,
    ...reviewResolvers.Mutation,
    ...cheeseResolvers.Mutation,
  },
  Manufacturer: manufacturerResolvers.Manufacturer,
  Review: reviewResolvers.Review,
  Cheese: cheeseResolvers.Cheese,
};
