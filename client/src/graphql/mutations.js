import gql from 'graphql-tag';

export const CREATE_MESSAGE = gql`
  mutation($text: String!, $file: Upload) {
    createMessage(text: $text, file: $file) {
      id
      text
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
