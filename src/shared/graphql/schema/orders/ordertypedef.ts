export const orderTypeDef = `
enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

enum PaymentMethod {
  POD
  PAYSTACK_CARD
  PAYSTACK_TRANSFER
  PAYSTACK_USSD
  PAYSTACK_MOBILE_MONEY
  PAYSTACK_QR
}

enum PaymentStatus {
  UNPAID
  PENDING
  PAID
  FAILED
}

input OrderItemInput {
  productId: ID!
  quantity: Int!
}

input ShippingAddressInput {
  street: String!
  city: String!
  state: String!
  postalCode: String!
  country: String!
}

input UpdateOrderStatusInput {
  orderId: ID!
  status: String!
  manualOverride: Boolean   
}


type PaystackInitResponse {
  authorizationUrl: String!
  reference: String!
}

type OrderItem {
  product: Product!
  vendor: Vendor!
  quantity: Int!
  unitPrice: Float!
  lineTotal: Float!
}

type Order {
  id: ID!
  items: [OrderItem!]!
  buyer: User!
  vendors: [Vendor!]!
  totalAmount: Float!
  shippingFee: Float!
  manualOverride: Boolean!
  shippingAddress: ShippingAddress!
  paymentMethod: PaymentMethod!
  paymentStatus: PaymentStatus!
  estimatedDeliveryDate: String
  status: OrderStatus!
  createdAt: String!
  updatedAt: String!
  shippedAt: Date
  deliveredAt: Date
}

scalar Date

type ShippingAddress {
  street: String!
  city: String!
  state: String!
  postalCode: String!
  country: String!
}

extend type Query {
  myOrders: [Order!]!
  vendorOrders: [Order!]!
  allOrders: [Order!]!
  order(id: ID!): Order
}

extend type Mutation {
  createOrder(
    items: [OrderItemInput!]!
    shippingAddress: ShippingAddressInput!
    paymentMethod: PaymentMethod!
  ): Order!

  updateOrderStatus(
    id: ID!
    status: OrderStatus!
  ): Order!

  markOrderShipped(id: ID!): Order!

  vendorUpdateOrderStatus(orderId: ID!, status: String!): Order!

  initiatePaystackPayment(orderId: ID!): PaystackInitResponse!
  verifyPaystackPayment(reference: String!): Order!
}

`;
