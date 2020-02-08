import React, { Fragment } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Badge from '@material-ui/core/Badge';
import FavoriteIcon from '@material-ui/icons/Favorite';

import WhoToFollow from '../components/WhoToFollow/WhoToFollow';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  username: {},
  timeAgo: { marginTop: theme.spacing(1) },
  icon: { fontSize: '0.7rem' },
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
        <List className={classes.root}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => {
            return (
              <Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Badge
                      badgeContent={
                        <FavoriteIcon className={classes.icon} />
                      }
                      color="primary"
                    >
                      <Avatar
                        alt="Remy Sharp"
                        src="http://i.pravatar.cc/300?img=5"
                      />
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <>
                        <Link
                          component={RouterLink}
                          to={`/`}
                          color="textPrimary"
                          className={classes.username}
                        >
                          Shirley Littel
                        </Link>{' '}
                        <Typography
                          variant="body2"
                          display="inline"
                          color="textSecondary"
                        >
                          liked your message
                        </Typography>
                      </>
                    }
                    secondary={
                      <Typography
                        className={classes.timeAgo}
                        variant="body2"
                        color="textSecondary"
                      >
                        5 minutes ago
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </Fragment>
            );
          })}
        </List>
      </Grid>
    </Grid>
  );
};

export default Notifications;
