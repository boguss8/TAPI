import { gql } from 'apollo-server-express';

export const cheeseType = gql`
  scalar Float

  type Allergen {
    name: String!
    severity: String!
    description: String!
  }

  type Packaging {
    type: String!
    material: String!
    recyclable: Boolean!
    weight: Int!
  }

  type NutritionalInfo {
    fatContent: String!
    protein: String!
    calories: Int!
    sodium: String!
  }

  type Cheese {
    id: ID!
    name: String!
    type: String!
    ageInMonths: Int!
    price: Float!
    milkType: String!
    nutritionalInfo: NutritionalInfo!
    origin: String!
    isArtisanal: Boolean!
    allergens: [Allergen!]!
    packaging: Packaging!
    reviews: [Review!]!
  }

  input AllergenInput {
    name: String!
    severity: String!
    description: String!
  }

  input PackagingInput {
    type: String!
    material: String!
    recyclable: Boolean!
    weight: Int!
  }

  input NutritionalInfoInput {
    fatContent: String!
    protein: String!
    calories: Int!
    sodium: String!
  }

  input CheeseFilterInput {
    name: StringFilterInput
    type: StringFilterInput
    ageInMonths: NumberFilterInput
    price: NumberFilterInput
    milkType: StringFilterInput
    origin: StringFilterInput
    isArtisanal: BooleanFilterInput
  }

  enum CheeseSortField {
    name
    type
    ageInMonths
    price
    milkType
    origin
  }

  input CheeseSortInput {
    field: CheeseSortField!
    order: SortOrder!
  }

  type CheeseConnection {
    nodes: [Cheese!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  extend type Query {
    cheeses(
      filter: CheeseFilterInput
      sort: CheeseSortInput
      pagination: PaginationInput
    ): CheeseConnection!
    cheese(id: ID!): Cheese
  }

  input CreateCheeseInput {
    name: String!
    type: String!
    ageInMonths: Int!
    price: Float!
    milkType: String!
    nutritionalInfo: NutritionalInfoInput!
    origin: String!
    isArtisanal: Boolean!
    allergens: [AllergenInput!]!
    packaging: PackagingInput!
  }

  input UpdateCheeseInput {
    id: ID!
    name: String
    type: String
    ageInMonths: Int
    price: Float
    milkType: String
    nutritionalInfo: NutritionalInfoInput
    origin: String
    isArtisanal: Boolean
    allergens: [AllergenInput!]
    packaging: PackagingInput
  }

  extend type Mutation {
    createCheese(input: CreateCheeseInput!): Cheese!
    updateCheese(input: UpdateCheeseInput!): Cheese!
    deleteCheese(id: ID!): Boolean!
  }
`;
