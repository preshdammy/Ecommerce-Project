
export const usertypedef = `#graphql
type User {
  id: ID!
  name: String!
  email: String!
  password: String!
  address: String!
  state: String!
  city: String
  gender: String!
  dateOfBirth: String
  profilePicture: String
  walletBalance: Float
  status: String
}

type Token {
  id: ID!
  name: String!
  email: String!
  password: String!
  token: String!
}

input UserProfileInput {
  id: ID
  name: String
  email: String
  address: String
  state: String
  city: String
  gender: String
  dateOfBirth: String
  profilePicture: String
}

type ChatItem {
  chatId: ID!
  vendor: VendorMinimal!
  latestMessage: Message!
}

type VendorMinimal {
  id: ID!
  name: String!
  profilePicture: String
}

type Query {
  users: [User!]!
  user(id: ID!): User
  userChatList(userId: ID!): [ChatItem!]!
   getUserProfile: User
}

type Mutation {
  createuser(name: String!, email: String!, password: String!): User!
  loginuser(email: String!, password: String!): Token!
 upsertProfile(input: UserProfileInput!): Use
  deleteuser(id: ID!): Boolean!
}




`;

