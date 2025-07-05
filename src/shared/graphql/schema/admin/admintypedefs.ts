export const adminTypeDefs = `
  scalar DateTime

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
    storeName: String
    avatar: String
    phone: String
    location: String
    createdAt: String
  }

  type User {
    id: ID!
    name: String!
    email: String!
    profilePicture: String
    city: String
    state: String
    gender: String
    dateOfBirth: String
  }

  type Product {
   id: ID!
   name: String!
   category: String!
   description: String!
   subCategory: String!
   color: String
   condition: String!
   minimumOrder: Int!
   price: Float!
   images: [String!]!
   createdAt: DateTime!
   updatedAt: DateTime!
   slug: String!
   seller: Vendor
   averageRating: Float
   totalReviews: Int
   stock: Int
 }

 type Order {
  id: ID!
  product: Product!
  buyer: User!
  vendor: Vendor!
  quantity: Int!
  totalAmount: Float!
  status: OrderStatus!
  createdAt: String!
  updatedAt: String!
 }
  enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
 }

  type Metrics {
    totalUsers: Int!
    totalVendors: Int!
    totalOrders: Int!
    totalSales: Int!
  }

  type Token {
    token: String!
    admin: Admin!
  }

  type Complaint {
  id: ID!
  message: String!
  createdAt: DateTime!
  user: User
  vendor: Vendor
 }

  type Query {
    adminProfile: Admin!
    allAdmins: [Admin!]!
    allVendors: [Vendor!]!
    allUsers: [User!]!
    allProducts(limit: Int = 20, offset: Int = 0): [Product!]!
    allOrders: [Order!]!
    getDashboardMetrics: Metrics!
    complaints: [Complaint!]!
  }

  type Mutation {
    loginAdmin(email: String!, password: String!): Token!
    seedAdmin(secret: String!): String!
    updateAdminRole(id: ID!, role: String!): Admin!
    deleteAdmin(id: ID!): String!
    addVendor(name: String!, email: String!): Vendor!
    deleteVendor(id: ID!): String!
    banVendor(id: ID!): Vendor!
    deleteUser(id: ID!): String!
    banUser(id: ID!): User!
    markOrderAsDelivered(orderId: ID!): String!
    refundOrder(orderId: ID!): String!
    requestPasswordReset(email: String!): Boolean!
    resetPassword(token: String!, newPassword: String!): Boolean!
  }
`;
