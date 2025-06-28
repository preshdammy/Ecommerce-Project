

export const reviewtypedef = `
  type Review {
    productId: ID!
    user: User!
    product: Product!
    rating: Int!
    comment: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
    scalar DateTime
  type Query {
    productReviews(productId: ID!): [Review!]!
  }

  type Mutation {
    createReview(productId: ID!, rating: Int!, comment: String!): Review!
  }
`;
