import gql from 'graphql-tag';

export default gql`
  type Autoplay {
    direction: String!
    createdAt: Date!
    duration: Int!
  }

  type Query {
    autoplay: Autoplay!
  }

  type Mutation {
    updateAutoplay(
      direction: String!
      createdAt: Date!
      duration: Int!
    ): Autoplay
  }
`;
