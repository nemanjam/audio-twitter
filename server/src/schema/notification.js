import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    notifications(cursor: String, limit: Int): NotificationConnection!
  }

  type NotificationConnection {
    edges: [Notification!]!
    pageInfo: PageInfo!
  }

  type Notification {
    id: ID!
    createdAt: Date!
    user: User!
    action: String!
  }

  extend type Subscription {
    notificationCreated: NotificationCreated!
    notSeenUpdated(username: String): Int!
  }

  type NotificationCreated {
    notification: Notification!
  }
`;
