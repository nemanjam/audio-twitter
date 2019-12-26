import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import { SignUpLink } from '../SignUp/SignUp';
import * as routes from '../../constants/routes';
import ErrorMessage from '../../components/Error/Error';

import { SIGN_IN } from '../../graphql/mutations';

const SignIn = ({ history, refetch }) => (
  <div>
    <h1>SignIn</h1>
    <SignInForm history={history} refetch={refetch} />
    <SignUpLink />
  </div>
);

const SignInForm = ({ history, refetch }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const [signIn, { loading, error }] = useMutation(SIGN_IN);

  const onChange = event => {
    const { name, value } = event.target;
    if (name === 'login') setLogin(value);
    if (name === 'password') setPassword(value);
  };

  const onSubmit = async event => {
    event.preventDefault();

    const { data } = await signIn({ variables: { login, password } });

    setLogin('');
    setPassword('');
    localStorage.setItem('token', data.signIn.token);
    await refetch();
    history.push(routes.LANDING);
  };

  const isInvalid = password === '' || login === '';

  return (
    <form onSubmit={event => onSubmit(event)}>
      <input
        name="login"
        value={login}
        onChange={onChange}
        type="text"
        placeholder="Email or Username"
      />
      <input
        name="password"
        value={password}
        onChange={onChange}
        type="password"
        placeholder="Password"
      />
      <button disabled={isInvalid || loading} type="submit">
        Sign In
      </button>

      {error && <ErrorMessage error={error} />}
    </form>
  );
};

export default withRouter(SignIn);

export { SignInForm };
