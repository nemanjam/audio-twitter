import React, { useState } from 'react';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import withSession from '../session/withSession';

import MessageCreate from '../components/MessageCreate/MessageCreate';
import Microphone from '../components/Microphone/Microphone';
import Messages from '../components/Messages/Messages';
import Autoplay from '../components/Autoplay/Autoplay';
import WhoToFollow from '../components/WhoToFollow/WhoToFollow';

const useStyles = makeStyles(theme => ({
  root: {},
  item: { width: '100%' },
}));

const Landing = ({ session }) => {
  const classes = useStyles();
  const [mainAutoplay, setMainAutoplay] = useState('none');

  return (
    <>
      <Grid
        container
        spacing={2}
        justify="center"
        direction="row-reverse"
      >
        <Grid
          item
          container
          md={4}
          sm={6}
          xs={12}
          className={classes.item}
          spacing={2}
          direction="column"
        >
          <Grid item>
            <Autoplay setMainAutoplay={setMainAutoplay} />
          </Grid>
          <Grid item>
            <WhoToFollow session={session} />
          </Grid>
        </Grid>
        <Grid item md={8} sm={6} xs={12} className={classes.item}>
          <Messages limit={2} />
        </Grid>
      </Grid>
      {session && session.me && <Microphone />}
    </>
  );
};

export default withSession(Landing);
