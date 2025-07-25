export const walletTypeDefs = `
  scalar Date

  type Wallet {
    id: ID!
    userId: ID!
    balance: Float!
    createdAt: Date!
    updatedAt: Date!
  }

  type PaystackInitResponse {
    authorization_url: String!
    access_code: String!
    reference: String!
  }

  extend type Query {
    getWalletBalance: Wallet!
  }

  extend type Mutation {
    initializeWalletFunding(amount: Float!): PaystackInitResponse!
    verifyWalletFunding(reference: String!): Wallet!
    withdrawFunds(amount: Float!): Wallet!
  }
`;
