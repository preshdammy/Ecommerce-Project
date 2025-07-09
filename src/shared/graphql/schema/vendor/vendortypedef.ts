import { gql } from 'graphql-tag';

const vendorTypeDefs = gql`
  type Vendor {
    id: ID!
    name: String!
    email: String!
    storeName: String
    profilePicture: String
    bio: String
    phone: String
    gender: String
    joinedDate: String
    location: String
    createdAt: String

    address: Address

    # Business Fields
    businessName: String
    businessDescription: String
    businessAddress: String
    businessCertificate: String
    businessOpeningTime: String
    businessClosingTime: String
    businessAvailability: String
  }

type Message {
  id: ID!
  senderId: ID!
  receiverId: ID!
  content: String!
   createdAt: String!
}

  type VendorAuthPayload {
    id: ID!
    name: String!
    email: String!
    storeName: String
    profilePicture: String
    bio: String
    phone: String
    gender: String
    joinedDate: String
    location: String
    token: String!

    address: Address

    # Business Fields
    businessName: String
    businessDescription: String
    businessAddress: String
    businessCertificate: String
    businessOpeningTime: String
    businessClosingTime: String
    businessAvailability: String
  }

  type Address {
    street: String
    city: String
    state: String
    zip: String
    country: String
  }

  input AddressInput {
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
    messages(chatId: ID!): [Message!]!
   messagesBetween(senderId: ID!, receiverId: ID!): [Message!]!
  }

  type Mutation {
    createVendor(
      name: String!
      email: String!
      password: String!
    ): Vendor!

    loginVendor(
      email: String!
      password: String!
    ): VendorAuthPayload!

    updateVendorProfile(
      email: String!
      name: String
      storeName: String
      profilePicture: String
      bio: String
      phone: String
      gender: String
      joinedDate: String
      location: String
      address: AddressInput

      businessName: String
      businessDescription: String
      businessAddress: String
      businessCertificate: String
      businessOpeningTime: String
      businessClosingTime: String
      businessAvailability: String
    ): Vendor

     changeVendorPassword(currentPassword: String!, newPassword: String!): Boolean!
       sendMessage(senderId: ID!, receiverId: ID!, content: String!): Message!
  }

`;

export default vendorTypeDefs;
