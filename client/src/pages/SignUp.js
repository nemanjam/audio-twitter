import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { default as MuiLink } from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import * as routes from '../constants/routes';
import ErrorMessage from '../components/Error/Error';

import { SIGN_UP } from '../graphql/mutations';

const SignUp = ({ history, refetch }) => (
  <SignUpForm history={history} refetch={refetch} />
);

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

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

    console.log(data);

    setUsername('');
    setEmail('');
    setPassword('');
    setPasswordConfirmation('');

    localStorage.setItem('token', data.signUp.token);
    await refetch();
    history.push(routes.HOME);
  };

  const isInvalid =
    password !== passwordConfirmation ||
    password === '' ||
    email === '' ||
    username === '';
  const classes = useStyles();
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form
          className={classes.form}
          onSubmit={event => onSubmit(event)}
          noValidate
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="username"
                value={username}
                onChange={onChange}
                label="Full Name"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                value={email}
                onChange={onChange}
                label="Email Address"
                name="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={password}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="passwordConfirmation"
                label="Confirm Password"
                type="password"
                value={passwordConfirmation}
                onChange={onChange}
              />
            </Grid>
          </Grid>
          {error && <ErrorMessage error={error} />}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={isInvalid || loading}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              Already have an account?{' '}
              <MuiLink to="/signin" component={Link} variant="body2">
                Sign in
              </MuiLink>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>
);

export default withRouter(SignUp);

export { SignUpForm, SignUpLink };
