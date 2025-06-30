
export const usertypedef = `
  type User {
    id: ID!
    name: String!
  }

  type Query {
    users: [User!]!
  }
`;

