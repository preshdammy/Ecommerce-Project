
import { gql } from 'graphql-tag';

const vendorTypeDefs = gql`
  type Vendor {
    id: ID!
    name: String!
    email: String!
    password: String!
    storeName: String
    avatar: String
    bio: String
    phone: String
    address: Address
    location: String
    createdAt: String
  }

  type VendorAuthPayload {
    id: ID!
    name: String!
    email: String!
    storeName: String
    avatar: String
    bio: String
    phone: String
    address: Address
    location: String
    token: String!
  }

  type Address {
    street: String
    city: String
    state: String
    zip: String
    country: String
  }

  type Query {
    vendors: [Vendor!]!
    getVendorProfile: Vendor!
    getVendorById(id: ID!): Vendor!
  }

  type Mutation {
   createVendor(
    name: String!
    email: String!
    password: String!
  ): Vendor!

    loginVendor(email: String!, password: String!): VendorAuthPayload!

    updateVendorProfile(
     email: String!
      name: String
      storeName: String
      avatar: String
      bio: String
      phone: String
      location: String
      address: AddressInput
    ): Vendor
  }

  input AddressInput {
    street: String
    city: String
    state: String
    zip: String
    country: String
  }
`;

export default vendorTypeDefs;
