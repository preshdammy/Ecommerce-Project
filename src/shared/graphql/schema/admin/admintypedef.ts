export const admintypedef = `
type Admin {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

   type Query {
    admins: [Admin]
  }
`