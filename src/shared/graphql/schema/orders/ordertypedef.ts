export const orderTypeDef = `
enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
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

extend type Query {
  myOrders: [Order!]!
  vendorOrders: [Order!]!
  allOrders: [Order!]!
  order(id: ID!): Order
}

extend type Mutation {
  createOrder(
    productId: ID!
    quantity: Int!
  ): Order!

  updateOrderStatus(
    id: ID!
    status: OrderStatus!
  ): Order!

  markOrderShipped(id: ID!): Order!
}

`