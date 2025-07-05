
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
}

type Token {
  id: ID!
  name: String!
  email: String!
  password: String!
  token: String!
}

input UpdateUserInput {
  id: ID!
  name: String!
  email: String!
  address: String!
  state: String!
  city: String
  gender: String!
  dateOfBirth: String
  profilePicture: String
}

type Query {
  users: [User!]!
  user(id: ID!): User
}

type Mutation {
  createuser(name: String!, email: String!, password: String!): User!
  loginuser(email: String!, password: String!): Token!
  updateuser(input: UpdateUserInput!): User!  
  deleteuser(id: ID!): Boolean!
}
`;
