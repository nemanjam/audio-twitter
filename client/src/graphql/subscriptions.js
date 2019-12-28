import gql from 'graphql-tag';

export const MESSAGE_CREATED = gql`
  subscription {
    messageCreated {
      message {
        id
        createdAt
        user {
          id
          username
        }
        file {
          path
        }
      }
    }
  }
`;
