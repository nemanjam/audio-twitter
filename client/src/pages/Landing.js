import React from 'react';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import withSession from '../session/withSession';

import MessageCreate from '../components/MessageCreate/MessageCreate';
import Messages from '../components/Messages/Messages';

const useStyles = makeStyles(theme => ({
  root: {},
  item: { width: '100%' },
}));

const Landing = ({ session }) => {
  const classes = useStyles();
  return (
    <Grid
      container
      alignContent="center"
      direction="column"
      className={classes.root}
    >
      <Grid item md={6} sm={8} xs={12} className={classes.item}>
        <h2>Landing Page</h2>
      </Grid>
      <Grid item md={6} sm={8} xs={12} className={classes.item}>
        {session && session.me && <MessageCreate />}
      </Grid>
      <Grid item md={6} sm={8} xs={12} className={classes.item}>
        <Messages limit={2} />
      </Grid>
    </Grid>
  );
};

export default withSession(Landing);
