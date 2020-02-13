import React, { Fragment, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import Fade from '@material-ui/core/Fade';
import Popper from '@material-ui/core/Popper';

import UserCard from '../UserCard/UserCard';

import {
  GET_FRIENDS,
  GET_REFETCH_FOLLOWERS,
} from '../../graphql/queries';
import {
  FOLLOW_USER,
  UNFOLLOW_USER,
  SET_REFETCH_FOLLOWERS,
} from '../../graphql/mutations';
import { UPLOADS_IMAGES_FOLDER } from '../../constants/paths';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  secondaryAction: {
    top: '27%',
  },
  noUsers: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
}));

const UsersTab = ({
  username,
  isFollowers,
  isFollowing,
  session,
}) => {
  const classes = useStyles();

  const { data, error, loading, refetch } = useQuery(GET_FRIENDS, {
    variables: { username, isFollowers, isFollowing, limit: 10 },
  });

  const {
    data: {
      refetchFollowers: { signal },
    },
  } = useQuery(GET_REFETCH_FOLLOWERS);

  useEffect(() => {
    refetch();
  }, [signal]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [popUpEntered, setPopUpEntered] = useState(false);
  const [nameEntered, setNameEntered] = useState(false);
  const [usernameState, setUsernameState] = useState('');

  useEffect(() => {
    setTimeout(() => {
      if (!popUpEntered && !nameEntered) {
        setAnchorEl(null);
        setPopUpEntered(false);
        setNameEntered(false);
      }
    }, 300);
  }, [popUpEntered, nameEntered]);

  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);
  const [setRefetchFollowers] = useMutation(SET_REFETCH_FOLLOWERS);

  const handleFollow = async user => {
    await followUser({ variables: { username: user.username } });
    setRefetchFollowers();
  };
  const handleUnfollow = async user => {
    await unfollowUser({ variables: { username: user.username } });
    setRefetchFollowers();
  };

  const handleMouseEnter = (event, user) => {
    setAnchorEl(event.currentTarget);
    setNameEntered(true);
    setUsernameState(user.username);
  };
  const handleMouseLeave = event => {
    setNameEntered(false);
  };

  const handlePopUpMouseEnter = event => {
    setPopUpEntered(true);
  };
  const handlePopUpMouseLeave = event => {
    setPopUpEntered(false);
  };

  // console.log(data, error);
  if (loading) return <CircularProgress color="inherit" />;
  const { friends: users } = data;

  return (
    <>
      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement="bottom"
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <UserCard
              onMouseEnter={handlePopUpMouseEnter}
              onMouseLeave={handlePopUpMouseLeave}
              username={usernameState}
              session={session}
            />
          </Fade>
        )}
      </Popper>
      <List className={classes.root}>
        {users.length === 0 && (
          <div className={classes.noUsers}>
            There are no users ...
          </div>
        )}
        <>
          {users.map((user, index) => {
            return (
              <Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Link
                      component={RouterLink}
                      to={`/${user.username}`}
                    >
                      <Avatar
                        alt={user.name}
                        src={`${UPLOADS_IMAGES_FOLDER}${user.avatar.path}`}
                      />
                    </Link>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Link
                        color="textPrimary"
                        component={RouterLink}
                        to={`/${user.username}`}
                        onMouseEnter={e => handleMouseEnter(e, user)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {user.name}
                      </Link>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          color="textSecondary"
                        >
                          @{user.username}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          color="textPrimary"
                          display="block"
                        >
                          {user.bio}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  <ListItemSecondaryAction
                    className={classes.secondaryAction}
                  >
                    {user.isFollowHim ? (
                      <Button
                        onClick={() => handleUnfollow(user)}
                        variant="contained"
                        color="primary"
                        size="small"
                      >
                        Unfollow
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleFollow(user)}
                        variant="outlined"
                        color="primary"
                        size="small"
                      >
                        Follow
                      </Button>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
                {index !== users.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </Fragment>
            );
          })}
        </>
      </List>
    </>
  );
};

export default UsersTab;
