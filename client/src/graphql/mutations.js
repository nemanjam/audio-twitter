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
  mutation($id: ID!) {
    deleteMessage(id: $id)
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

export const UPDATE_AUTOPLAY = gql`
  mutation($direction: String!, $createdAt: Date!, $duration: Int!) {
    updateAutoplay(
      direction: $direction
      createdAt: $createdAt
      duration: $duration
    ) @client
  }
`;
