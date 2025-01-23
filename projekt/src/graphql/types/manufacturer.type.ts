import { gql } from 'apollo-server-express';

export const manufacturerType = gql`
  scalar URL
  scalar Date

  input StringFilterInput {
    eq: String
    contains: String
    ne: String
    notContains: String
  }

  input NumberFilterInput {
    eq: Int
    gt: Int
    gte: Int
    lt: Int
    lte: Int
    ne: Int
  }

  input BooleanFilterInput {
    eq: Boolean
  }

  input DateFilterInput {
    eq: Date
    gt: Date
    gte: Date
    lt: Date
    lte: Date
    ne: Date
  }

  input ManufacturerFilterInput {
    name: StringFilterInput
    country: StringFilterInput
    foundedYear: NumberFilterInput
    employeeCount: NumberFilterInput
    website: StringFilterInput
    isOrganic: BooleanFilterInput
  }

  input PaginationInput {
    limit: Int!
    offset: Int!
  }

  enum SortOrder {
    ASC
    DESC
  }

  input ManufacturerSortInput {
    field: ManufacturerSortField!
    order: SortOrder!
  }

  enum ManufacturerSortField {
    name
    country
    foundedYear
    employeeCount
    website
  }

  type Certificate {
    name: String!
    issueDate: Date!
    expiryDate: Date!
    issuingBody: String!
    certificationNumber: String!
  }

  type Headquarters {
    city: String!
    address: String!
    postalCode: String!
    country: String!
  }

  type Manufacturer {
    id: ID!
    name: String!
    country: String!
    foundedYear: Int!
    website: URL!
    employeeCount: Int!
    isOrganic: Boolean!
    headquarters: Headquarters!
    certificates: [Certificate]!
    producedCheeses: [Cheese]!
  }

  input ManufacturerSearchInput {
    ids: [ID!]
    names: [String!]
  }

  extend type Query {
    manufacturers(
      search: ManufacturerSearchInput
      filter: ManufacturerFilterInput
      sort: ManufacturerSortInput
      pagination: PaginationInput
    ): ManufacturerConnection!
    manufacturer(id: ID!): Manufacturer
  }

  type ManufacturerConnection {
    nodes: [Manufacturer]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  extend type Mutation {
    createManufacturer(input: CreateManufacturerInput!): Manufacturer!
    updateManufacturer(input: UpdateManufacturerInput!): Manufacturer!
    deleteManufacturer(id: ID!): Boolean!
  }

  input CreateManufacturerInput {
    name: String
    country: String
    foundedYear: Int
    website: URL
    employeeCount: Int
    isOrganic: Boolean
    headquarters: HeadquartersInput
    certificates: [CertificateInput]
    producedCheeses: [ID]
  }

  input UpdateManufacturerInput {
    id: ID!
    name: String
    country: String
    foundedYear: Int
    website: URL
    employeeCount: Int
    isOrganic: Boolean
    headquarters: HeadquartersInput
    certificates: [CertificateInput]
    producedCheeses: [ID]
  }

  input HeadquartersInput {
    city: String
    address: String
    postalCode: String
    country: String
  }

  input CertificateInput {
    name: String
    issueDate: Date
    expiryDate: Date
    issuingBody: String
    certificationNumber: String
  }
`;
