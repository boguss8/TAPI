import { gql } from 'apollo-server-express';
import { cheeseType } from './types/cheese.type';
import { manufacturerType } from './types/manufacturer.type';
import { reviewType } from './types/review.type';

const baseType = gql`
  scalar Date
  scalar URL

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

export default [baseType, manufacturerType, cheeseType, reviewType];
