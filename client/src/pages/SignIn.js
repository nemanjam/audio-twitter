import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { default as MuiLink } from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { SignUpLink } from './SignUp';
import * as routes from '../constants/routes';
import ErrorMessage from '../components/Error/Error';

import { resetWebsocket } from '../index';
import { SIGN_IN } from '../graphql/mutations';

const SignIn = ({ history, refetch }) => (
  <SignInForm history={history} refetch={refetch} />
);

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

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
    localStorage.removeItem('token');

    const { data } = await signIn({ variables: { login, password } });

    setLogin('');
    setPassword('');
    localStorage.setItem('token', data.signIn.token);
    await refetch();
    history.push(routes.HOME);
    resetWebsocket();
  };

  const isInvalid =
    !(password === '' && login === '') &&
    (password === '' || login === '');
  const classes = useStyles();
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form
          onSubmit={event => onSubmit(event)}
          className={classes.form}
          noValidate
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="login"
            label="Username"
            name="login"
            value={login}
            onChange={onChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            value={password}
            onChange={onChange}
            label="Password"
            type="password"
            id="password"
          />
          {error && <ErrorMessage error={error} />}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={isInvalid}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs />
            <Grid item>
              Don't have an account?{' '}
              <MuiLink to="/signup" component={Link} variant="body2">
                Sign Up
              </MuiLink>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default withRouter(SignIn);

export { SignInForm };
