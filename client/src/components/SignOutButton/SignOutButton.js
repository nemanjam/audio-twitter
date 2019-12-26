import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';

import * as routes from '../../constants/routes';
import history from '../../constants/history';

const SignOutButton = () => {
  const client = useApolloClient();

  return (
    <button type="button" onClick={() => signOut(client)}>
      Sign Out
    </button>
  );
};

const signOut = client => {
  localStorage.removeItem('token');
  client.resetStore();
  history.push(routes.SIGN_IN);
};

export { signOut };

export default SignOutButton;
