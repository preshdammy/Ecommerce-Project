export const walletTypeDefs = `
  scalar Date

  type Wallet {
    id: ID!
    userId: ID!
    balance: Float!
    createdAt: Date!
    updatedAt: Date!
  }

   type WalletTransaction {
    id: ID!
    user: ID!
    type: String!           
    amount: Float!
    reference: String
    status: String!
    createdAt: Date!
  }

  type PaystackInitResponse {
    authorization_url: String!
    access_code: String!
    reference: String!
  }

  extend type Query {
    getWalletBalance: Wallet!
    myWalletTransactions: [WalletTransaction!]!
  }

  extend type Mutation {
    initializeWalletFunding(amount: Float!): PaystackInitResponse!
    verifyWalletFunding(reference: String!): Wallet!
    withdrawFunds(amount: Float!): Wallet!
  }
`;
