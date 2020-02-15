import React, { Fragment } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import NotificationsList from '../components/Notifications/Notifications';
import WhoToFollow from '../components/WhoToFollow/WhoToFollow';
import withAuthorization from '../session/withAuthorization';

const useStyles = makeStyles(theme => ({
  root: {},
}));

const Notifications = ({ session }) => {
  const classes = useStyles();

  return (
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
          <WhoToFollow session={session} />
        </Grid>
      </Grid>
      <Grid item md={8} sm={6} xs={12} className={classes.item}>
        <NotificationsList session={session} />
      </Grid>
    </Grid>
  );
};

export default withAuthorization(session => session?.me)(
  Notifications,
);
