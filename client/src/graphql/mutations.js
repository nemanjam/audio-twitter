import gql from 'graphql-tag';

export const CREATE_MESSAGE = gql`
  mutation($file: Upload!) {
    createMessage(file: $file) {
      id
      createdAt
      user {
        id
        username
      }
      file {
        id
        path
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation(
    $name: String
    $bio: String
    $avatar: Upload
    $cover: Upload
  ) {
    updateUser(
      name: $name
      bio: $bio
      avatar: $avatar
      cover: $cover
    ) {
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
    }
  }
`;

export const DELETE_MESSAGE = gql`
  mutation($messageId: ID!) {
    deleteMessage(messageId: $messageId)
  }
`;

export const SIGN_IN = gql`
  mutation($login: String!, $password: String!) {
    signIn(login: $login, password: $password) {
      token
    }
  }
`;

export const SIGN_UP = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    signUp(username: $username, email: $email, password: $password) {
      token
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation($username: String!) {
    followUser(username: $username)
  }
`;

export const UNFOLLOW_USER = gql`
  mutation($username: String!) {
    unfollowUser(username: $username)
  }
`;

export const LIKE_MESSAGE = gql`
  mutation($messageId: ID!) {
    likeMessage(messageId: $messageId)
  }
`;

export const UNLIKE_MESSAGE = gql`
  mutation($messageId: ID!) {
    unlikeMessage(messageId: $messageId)
  }
`;

export const REPOST_MESSAGE = gql`
  mutation($messageId: ID!) {
    repostMessage(messageId: $messageId)
  }
`;

export const UNREPOST_MESSAGE = gql`
  mutation($messageId: ID!) {
    unrepostMessage(messageId: $messageId)
  }
`;

export const UPDATE_AUTOPLAY = gql`
  mutation($direction: String!, $createdAt: Date!, $duration: Int!) {
    updateAutoplay(
      direction: $direction
      createdAt: $createdAt
      duration: $duration
    ) @client
  }
`;

export const SET_THEME = gql`
  mutation($type: String!, $color: String!) {
    setTheme(type: $type, color: $color) @client
  }
`;

export const SET_REFETCH_FOLLOWERS = gql`
  mutation {
    setRefetchFollowers @client
  }
`;

export const SET_MESSAGES_VARIABLES = gql`
  mutation($username: String, $cursor: String, $limit: Int) {
    setMessagesVariables(
      username: $username
      cursor: $cursor
      limit: $limit
    ) @client
  }
`;
