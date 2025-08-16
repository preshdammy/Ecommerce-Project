import { gql } from 'graphql-tag';

const vendorTypeDefs = gql`
  scalar DateTime


  type Vendor {
    id: ID!
    name: String!
    email: String!
    personalEmail: String
    personalProfilePic: String
    profileName: String
    storeName: String
    profilePicture: String
    bio: String
    phone: String
    gender: String
    joinedDate: String
    location: String
    createdAt: String
    status: String

    
    suspendedUntil: DateTime
    stats: VendorStats
    products: [Product]
    actions: [VendorAction]

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

type VendorStats {
  totalSales: Float
  productCount: Int
  ratingAverage: Float
  salesPerMonth: [SalesData]
}

type SalesData {
  month: String
  total: Float
}

type VendorAction {
  action: String!
  performedBy: String
  performedAt: DateTime
  notes: String
}

  type VendorAuthPayload {
    id: ID!
    name: String!
    email: String!
    personalEmail: String
    personalProfilePic: String
    profileName: String
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
      personalEmail: String
      personalProfilePic: String
      name: String
      profileName: String
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
     sendMessage(chatId: ID!, senderId: ID!, receiverId: ID!, content: String!): Message!
    
  }

  type ChatItem {
  chatId: ID!
  buyer: User!
  latestMessage: Message
}

extend type Query {
  vendorChatList(vendorId: ID!): [ChatItem!]!
}


`;

export default vendorTypeDefs;
