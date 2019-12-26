import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import * as routes from '../../constants/routes';
import ErrorMessage from '../../components/Error/Error';

import { SIGN_UP } from '../../graphql/mutations';

const SignUp = ({ history, refetch }) => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm history={history} refetch={refetch} />
  </div>
);

const SignUpForm = ({ history, refetch }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState(
    '',
  );

  const [signUp, { loading, error }] = useMutation(SIGN_UP);

  const onChange = event => {
    const { name, value } = event.target;
    if (name === 'username') setUsername(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'passwordConfirmation')
      setPasswordConfirmation(value);
  };

  const onSubmit = async event => {
    event.preventDefault();

    const { data } = await signUp({
      variables: { username, email, password },
    });

    setUsername('');
    setEmail('');
    setPassword('');
    setPasswordConfirmation('');

    localStorage.setItem('token', data.signUp.token);
    await refetch();
    history.push(routes.LANDING);
  };

  const isInvalid =
    password !== passwordConfirmation ||
    password === '' ||
    email === '' ||
    username === '';

  return (
    <form onSubmit={event => onSubmit(event)}>
      <input
        name="username"
        value={username}
        onChange={onChange}
        type="text"
        placeholder="Full Name"
      />
      <input
        name="email"
        value={email}
        onChange={onChange}
        type="text"
        placeholder="Email Address"
      />
      <input
        name="password"
        value={password}
        onChange={onChange}
        type="password"
        placeholder="Password"
      />
      <input
        name="passwordConfirmation"
        value={passwordConfirmation}
        onChange={onChange}
        type="password"
        placeholder="Confirm Password"
      />
      <button disabled={isInvalid || loading} type="submit">
        Sign Up
      </button>

      {error && <ErrorMessage error={error} />}
    </form>
  );
};

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>
);

export default withRouter(SignUp);

export { SignUpForm, SignUpLink };
