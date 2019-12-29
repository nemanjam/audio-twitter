import React, { Fragment } from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

import Navigation from '../components/Navigation/Navigation';

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(8),
  },
}));

const Layout = ({ children, session }) => {
  const classes = useStyles();

  return (
    <Fragment>
      <CssBaseline />
      <Navigation session={session} />
      <Container className={classes.container} maxWidth="lg">
        {children}
      </Container>
      <div></div>
    </Fragment>
  );
};

export default Layout;
