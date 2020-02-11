import gql from 'graphql-tag';

export const GET_ALL_MESSAGES_WITH_USERS = gql`
  query {
    messages @connection(key: "MessagesConnection") {
      edges {
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
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_PAGINATED_NOTIFICATIONS = gql`
  query($cursor: String, $limit: Int!) {
    notifications(cursor: $cursor, limit: $limit)
      @connection(key: "NotificationsConnection") {
      edges {
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
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_FRIENDS = gql`
  query(
    $username: String!
    $isFollowers: Boolean
    $isFollowing: Boolean
    $limit: Int
  ) {
    friends(
      username: $username
      isFollowers: $isFollowers
      isFollowing: $isFollowing
      limit: $limit
    ) {
      id
      username
      name
      bio
      isFollowsMe
      isFollowHim
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

export const GET_WHO_TO_FOLLOW = gql`
  query($limit: Int) {
    whoToFollow(limit: $limit) {
      id
      username
      name
      isFollowsMe
      isFollowHim
      avatar {
        id
        path
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
      isFollowsMe
      isFollowHim
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

export const GET_THEME = gql`
  query {
    theme @client {
      type
      color
    }
  }
`;

export const GET_REFETCH_FOLLOWERS = gql`
  query {
    refetchFollowers @client {
      signal
    }
  }
`;
