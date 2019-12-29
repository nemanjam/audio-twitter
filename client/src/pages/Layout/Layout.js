import React, { Fragment } from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';

import Navigation from '../../components/Navigation/Navigation';

const useStyles = makeStyles(theme => ({
  content: {
    maxWidth: 1100,
    padding: theme.spacing(4),
    margin: 'auto',
  },
}));

const Layout = ({ children, session }) => {
  const classes = useStyles();

  return (
    <Fragment>
      <CssBaseline />
      <Navigation session={session} />
      <div className={classes.content}>{children}</div>
    </Fragment>
  );
};

export default Layout;
