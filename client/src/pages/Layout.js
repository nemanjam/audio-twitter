import React, { Fragment } from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

import getThemeFn from '../theme/theme';
import withTheme from '../theme/withTheme';

import Navigation from '../components/Navigation/Navigation';

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(10),
    maxWidth: 1000,
  },
}));

const Layout = ({ children, session, match }) => {
  const classes = useStyles();

  return (
    <Fragment>
      <CssBaseline />
      <Navigation match={match} session={session} />
      <Container className={classes.container}>{children}</Container>
    </Fragment>
  );
};

export default withTheme(getThemeFn)(Layout);
