import { gql } from 'apollo-server-express';

export const reviewType = gql`
  scalar Date

  type Reviewer {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    purchaseHistory: Int!
  }

  input ReviewerInput {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    purchaseHistory: Int!
  }

  type DetailedRatings {
    flavor: Int!
    texture: Int!
    value: Int!
    packaging: Int!
    overall: Int!
  }

  input DetailedRatingsInput {
    flavor: Int!
    texture: Int!
    value: Int!
    packaging: Int!
    overall: Int!
  }

  type Review {
    id: ID!
    cheese: Cheese!
    reviewer: Reviewer!
    ratings: DetailedRatings!
    comment: String!
    verifiedPurchase: Boolean!
    datePosted: Date!
    helpfulVotes: Int!
    wouldRecommend: Boolean!
  }

  input ReviewFilterInput {
    comment: StringFilterInput
    verifiedPurchase: BooleanFilterInput
    datePosted: DateFilterInput
    helpfulVotes: NumberFilterInput
    wouldRecommend: BooleanFilterInput
    ratings: RatingsFilterInput
  }

  input RatingsFilterInput {
    flavor: NumberFilterInput
    texture: NumberFilterInput
    value: NumberFilterInput
    packaging: NumberFilterInput
    overall: NumberFilterInput
  }

  enum ReviewSortField {
    datePosted
    helpfulVotes
    overall
  }

  input ReviewSortInput {
    field: ReviewSortField!
    order: SortOrder!
  }

  type ReviewConnection {
    nodes: [Review!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  extend type Query {
    reviews(
      filter: ReviewFilterInput
      sort: ReviewSortInput
      pagination: PaginationInput
    ): ReviewConnection!
    review(id: ID!): Review
  }

  extend type Mutation {
    createReview(input: CreateReviewInput!): Review!
    updateReview(input: UpdateReviewInput!): Review!
    deleteReview(id: ID!): Boolean!
  }

  input CreateReviewInput {
    cheeseId: ID!
    reviewer: ReviewerInput!
    ratings: DetailedRatingsInput!
    comment: String!
    verifiedPurchase: Boolean!
    datePosted: Date!
    helpfulVotes: Int!
    wouldRecommend: Boolean!
  }

  input UpdateReviewInput {
    id: ID!
    cheeseId: ID
    reviewer: ReviewerInput
    ratings: DetailedRatingsInput
    comment: String
    verifiedPurchase: Boolean
    datePosted: Date
    helpfulVotes: Int
    wouldRecommend: Boolean
  }
`;
