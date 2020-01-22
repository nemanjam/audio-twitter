import React from 'react';
import { Link } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Button from '@material-ui/core/Button';

import * as routes from '../../constants/routes';
import SignOutButton from '../SignOutButton/SignOutButton';

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  title: {
    marginRight: theme.spacing(2),
    fontWeight: 700,
  },
  flex: {
    flex: 1,
  },
}));

const Navigation = ({ session }) => {
  const classes = useStyles();
  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <CameraIcon className={classes.icon} />
          <Typography
            variant="h6"
            color="inherit"
            className={classes.title}
            noWrap
          >
            Audio Twitter
          </Typography>

          <Button
            color="inherit"
            component={Link}
            to={routes.LANDING}
          >
            Landing
          </Button>
          {session && session.me && (
            <Button
              color="inherit"
              component={Link}
              to={routes.ACCOUNT}
            >
              Account
            </Button>
          )}
          {session && session.me && session.me.role === 'ADMIN' && (
            <Button
              color="inherit"
              component={Link}
              to={routes.ADMIN}
            >
              Admin
            </Button>
          )}
          <div className={classes.flex}> {Math.random()}</div>
          {session && session.me ? (
            <>
              <SignOutButton />
              <Typography variant="caption" color="inherit" noWrap>
                ({session.me.username})
              </Typography>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to={routes.SIGN_UP}
              >
                Sign Up
              </Button>
              <Button
                color="inherit"
                component={Link}
                to={routes.SIGN_IN}
              >
                Sign In
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navigation;
