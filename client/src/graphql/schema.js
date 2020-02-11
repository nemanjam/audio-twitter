import gql from 'graphql-tag';

export default gql`
  type Autoplay {
    direction: String!
    createdAt: Date!
    duration: Int!
  }

  type Theme {
    type: String!
    color: String!
  }

  type MessagesVariables {
    username: String
    cursor: String
    limit: Int
  }

  type Query {
    autoplay: Autoplay!
    theme: Theme!
    refetchFollowers: Int!
    messagesVariables: MessagesVariables!
  }

  type Mutation {
    updateAutoplay(
      direction: String!
      createdAt: Date!
      duration: Int!
    ): Autoplay

    setTheme(type: String!, color: String!): Theme!
    setRefetchFollowers: Int!
    setMessagesVariables(
      username: String
      cursor: String
      limit: Int
    ): MessagesVariables!
  }
`;
