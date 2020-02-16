import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';

import Button from '@material-ui/core/Button';

import * as routes from '../../constants/routes';
import history from '../../constants/history';

const SignOutButton = () => {
  const client = useApolloClient();

  return (
    <Button color="inherit" onClick={() => signOut(client)}>
      Sign Out
    </Button>
  );
};

const signOut = client => {
  localStorage.removeItem('token');
  client.resetStore();
  history.push(routes.SIGN_IN);
};

export { signOut };

export default SignOutButton;
