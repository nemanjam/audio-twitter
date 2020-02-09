import React, { Fragment, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';

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
import RepeatIcon from '@material-ui/icons/Repeat';
import PersonIcon from '@material-ui/icons/Person';

import Loading from '../Loading/Loading';
import { GET_PAGINATED_NOTIFICATIONS } from '../../graphql/queries';
import { NOTIFICATION_CREATED } from '../../graphql/subscriptions';
import { UPLOADS_IMAGES_FOLDER } from '../../constants/paths';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  username: {},
  timeAgo: { marginTop: theme.spacing(1) },
  icon: { fontSize: '0.7rem' },
  noNotifications: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
}));

const Notifications = ({ session }) => {
  const classes = useStyles();

  const {
    data,
    loading,
    error,
    refetch,
    fetchMore,
    subscribeToMore,
  } = useQuery(GET_PAGINATED_NOTIFICATIONS, {
    variables: { limit: 10 },
  });

  const subscribeToMoreNotification = useCallback(() => {
    subscribeToMore({
      document: NOTIFICATION_CREATED,
      variables: {},
      updateQuery: (previousResult, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return previousResult;
        }

        const { notificationCreated } = subscriptionData.data;

        return {
          ...previousResult,
          notifications: {
            ...previousResult.notifications,
            edges: [
              notificationCreated.notification,
              ...previousResult.notifications.edges,
            ],
          },
        };
      },
    });
  }, [subscribeToMore]);

  useEffect(() => {
    subscribeToMoreNotification();
  }, [subscribeToMoreNotification]);

  useEffect(() => {
    refetch();
  }, []);

  const getActionText = action => {
    switch (action) {
      case 'like':
        return {
          text: 'liked your message',
          color: 'primary',
          icon: <FavoriteIcon className={classes.icon} />,
        };
      case 'unlike':
        return {
          text: 'unliked your message',
          color: 'secondary',
          icon: <FavoriteIcon className={classes.icon} />,
        };
      case 'repost':
        return {
          text: 'reposted your message',
          color: 'primary',
          icon: <RepeatIcon className={classes.icon} />,
        };
      case 'unrepost':
        return {
          text: 'unreposted your message',
          color: 'secondary',
          icon: <RepeatIcon className={classes.icon} />,
        };
      case 'follow':
        return {
          text: 'followed you',
          color: 'primary',
          icon: <PersonIcon className={classes.icon} />,
        };
      case 'unfollow':
        return {
          text: 'unfollowed you',
          color: 'secondary',
          icon: <PersonIcon className={classes.icon} />,
        };
    }
  };

  if (loading) {
    return <Loading />;
  }

  const { edges, pageInfo } = data.notifications;

  //console.log(data, error);

  return (
    <List className={classes.root}>
      {edges.length === 0 && (
        <div className={classes.noNotifications}>
          There are no notifications yet ...
        </div>
      )}
      <>
        {edges.map((notification, index) => {
          return (
            <Fragment key={index}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Badge
                    badgeContent={
                      getActionText(notification.action).icon
                    }
                    color={getActionText(notification.action).color}
                  >
                    <Avatar
                      alt={notification.user.name}
                      src={`${UPLOADS_IMAGES_FOLDER}${notification.user.avatar.path}`}
                    />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <>
                      <Link
                        component={RouterLink}
                        to={`/${notification.user.username}`}
                        color="textPrimary"
                        className={classes.username}
                      >
                        {notification.user.name}
                      </Link>{' '}
                      <Typography
                        variant="body2"
                        display="inline"
                        color="textSecondary"
                      >
                        {getActionText(notification.action).text}
                      </Typography>
                    </>
                  }
                  secondary={
                    <Typography
                      className={classes.timeAgo}
                      variant="body2"
                      color="textSecondary"
                    >
                      {moment(notification.createdAt).fromNow()}
                    </Typography>
                  }
                />
              </ListItem>
              {index !== edges.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </Fragment>
          );
        })}
      </>
    </List>
  );
};

export default Notifications;
