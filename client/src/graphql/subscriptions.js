import gql from 'graphql-tag';

export const MESSAGE_CREATED = gql`
  subscription($username: String) {
    messageCreated(username: $username) {
      message {
        id
        createdAt
        likesCount
        isLiked
        repostsCount
        isReposted
        user {
          id
          username
          name
          avatar {
            id
            path
          }
        }
        file {
          id
          path
        }
      }
    }
  }
`;
