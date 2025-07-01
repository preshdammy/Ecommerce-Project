export const vendortypedef = `
  type Admin {
    id: ID!
    email: String!
    role: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    
  }
    scalar DateTime

  type AuthPayload {
    token: String!
    admin: Admin!
  }

  type Query {
    adminProfile: Admin!
    allAdmins: Admin!
  }

  type Mutation {
    loginAdmin(email: String!, password: String!): AuthPayload!
    seedAdmin(secret: String!): String!
  }
`;

