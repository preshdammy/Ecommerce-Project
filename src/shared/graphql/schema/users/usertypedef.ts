export const usertypedef =` {
    type User {
    id: ID!
    username: String!
    email: String!
  }
    

  type Token {
    id: ID!
    email: String!
    password:String!
    token: String!
  }

  type Query {
 users: [User!]!
 user(id: ID!): User
}
  type Mutation {
    createuser(username: String!, email: String!, password: String!): User!
    loginuser(email: String!, password: String!): Token!
  }
`
;