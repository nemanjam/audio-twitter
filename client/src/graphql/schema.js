import gql from 'graphql-tag';

export default gql`
  type Autoplay {
    direction: String!
    index: Int!
  }

  type Query {
    autoplay: Autoplay!
  }

  type Mutation {
    updateAutoplay(direction: String, index: Int!): Autoplay
  }
`;
