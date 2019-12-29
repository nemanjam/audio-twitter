import React from 'react';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import withSession from '../../session/withSession';

import MessageCreate from '../../components/MessageCreate/MessageCreate';
import Messages from '../../components/Messages/Messages';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 1200,
    margin: ' 0 auto',
    padding: theme.spacing(4),
  },
}));

const Landing = ({ session }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <h2>Landing Page</h2>

      {session && session.me && <MessageCreate />}
      <Messages limit={2} />
    </div>
  );
};

export default withSession(Landing);
