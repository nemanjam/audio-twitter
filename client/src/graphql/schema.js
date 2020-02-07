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

  type Query {
    autoplay: Autoplay!
    theme: Theme!
  }

  type Mutation {
    updateAutoplay(
      direction: String!
      createdAt: Date!
      duration: Int!
    ): Autoplay

    setTheme(type: String!, color: String!): Theme!
  }
`;
