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
        isRepostedByMe
        repost {
          reposter {
            id
            username
            name
          }
          originalMessage {
            id
            createdAt
          }
        }
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

export const NOTIFICATION_CREATED = gql`
  subscription {
    notificationCreated {
      notification {
        id
        createdAt
        action
        user {
          id
          username
          name
          avatar {
            id
            path
          }
        }
      }
    }
  }
`;

export const NOT_SEEN_UPDATED = gql`
  subscription($username: String) {
    notSeenUpdated(username: $username)
  }
`;
