import gql from 'graphql-tag';

export const GET_ALL_MESSAGES_WITH_USERS = gql`
  query {
    messages(order: "DESC") @connection(key: "MessagesConnection") {
      edges {
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
      pageInfo {
        hasNextPage
      }
    }
  }
`;

export const GET_PAGINATED_MESSAGES_WITH_USERS = gql`
  query($cursor: String, $limit: Int!, $username: String) {
    messages(cursor: $cursor, limit: $limit, username: $username)
      @connection(key: "MessagesConnection") {
      edges {
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
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_USERS = gql`
  query($limit: Int) {
    users(limit: $limit) {
      id
      username
      name
      bio
      avatar {
        id
        path
      }
      cover {
        id
        path
      }
      followers {
        id
        username
        name
        avatar {
          id
          path
        }
      }
      following {
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
`;

export const GET_WHO_TO_FOLLOW = gql`
  query($limit: Int) {
    whoToFollow(limit: $limit) {
      id
      username
      name
      avatar {
        id
        path
      }
      followers {
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
`;

export const GET_USER = gql`
  query($username: String!) {
    user(username: $username) {
      id
      username
      name
      bio
      followersCount
      followingCount
      messagesCount
      followers {
        id
        username
        name
        avatar {
          id
          path
        }
      }
      following {
        id
        username
        name
        avatar {
          id
          path
        }
      }
      avatar {
        id
        path
      }
      cover {
        id
        path
      }
    }
  }
`;

export const GET_AUTOPLAY = gql`
  query {
    autoplay @client {
      direction
      createdAt
      duration
    }
  }
`;
