export const vendortypedef = `
 type Vendor {
    id: ID!
    companyName: String!
    email: String!
    role: String!
  }

  extend type Query {
    allVendors: [Vendor!]!
  }

`