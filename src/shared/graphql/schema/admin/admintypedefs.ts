export const adminTypeDefs = `
 type Admin {
  id: ID!
  name: String!
  email: String!
  role: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}


  type Vendor {
    id: ID!
    name: String!
    email: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    isBanned: Boolean!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    isBanned: Boolean!
  }

  type Metrics {
    totalUsers: Int!
    totalVendors: Int!
    totalOrders: Int!
    totalSales: Int!
  }

  scalar DateTime

  type Token {
    token: String!
    admin: Admin!
  }

  type AuthPayload {
    token: String!
    admin: Admin!
  }

  type Query {
    adminProfile: Admin!
    allAdmins: Admin!
    allVendors: [Vendor!]!
    allUsers: [User!]!
    getDashboardMetrics: Metrics!
  }

  type Mutation {
    loginAdmin(email: String!, password: String!): AuthPayload!
    seedAdmin(secret: String!): String!

    # Admin Management
    updateAdminRole(id: ID!, role: String!): Admin!
    deleteAdmin(id: ID!): String!

    # Vendor Management
    addVendor(name: String!, email: String!): Vendor!
    deleteVendor(id: ID!): String!
    banVendor(id: ID!): Vendor!

    # User Management
    deleteUser(id: ID!): String!
    banUser(id: ID!): User!

    # Product/Order Management (Optional to implement)
    deleteProduct(id: ID!): String!
    markOrderAsDelivered(orderId: ID!): String!
    refundOrder(orderId: ID!): String!
  }
`;
