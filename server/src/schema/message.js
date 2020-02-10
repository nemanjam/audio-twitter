import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    messages(
      cursor: String
      limit: Int
      username: String
    ): MessageConnection!
    message(id: ID!): Message!
  }

  extend type Mutation {
    createMessage(file: Upload!): Message!
    deleteMessage(id: ID!): Boolean!
    likeMessage(messageId: ID!): Boolean!
    unlikeMessage(messageId: ID!): Boolean!
    repostMessage(messageId: ID!): Boolean!
    unrepostMessage(messageId: ID!): Boolean!
  }

  type MessageConnection {
    edges: [Message!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String!
  }

  type Repost {
    reposter: User
    originalMessage: Message
  }

  type Message {
    id: ID!
    createdAt: Date!
    user: User!
    file: File!
    likesCount: Int!
    isLiked: Boolean!
    repostsCount: Int!
    isRepostedByMe: Boolean!
    isReposted: Boolean!
    repost: Repost
  }

  extend type Subscription {
    messageCreated(username: String): MessageCreated!
  }

  type MessageCreated {
    message: Message!
  }
`;
