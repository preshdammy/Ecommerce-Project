
export const notificationTypeDef = `
  scalar Date

  type Notification {
    id: ID!
    recipientId: ID!
    recipientRole: String!
    type: String!
    title: String!
    message: String!
    isRead: Boolean!
    createdAt: Date!
  }

  type Query {
    myNotifications: [Notification!]!
  }

  type Mutation {
    createNotification(
      recipientId: ID!
      recipientRole: String!
      type: String!
      title: String!
      message: String!
    ): Notification!

    markNotificationAsRead(notificationId: ID!): Notification!

    deleteNotification(notificationId: ID!): Boolean!
  }
`;
