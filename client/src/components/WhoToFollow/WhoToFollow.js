import React, { Fragment, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import Fade from '@material-ui/core/Fade';
import Popper from '@material-ui/core/Popper';

import {
  GET_WHO_TO_FOLLOW,
  GET_REFETCH_FOLLOWERS,
} from '../../graphql/queries';
import {
  FOLLOW_USER,
  UNFOLLOW_USER,
  SET_REFETCH_FOLLOWERS,
} from '../../graphql/mutations';
import { UPLOADS_IMAGES_FOLDER } from '../../constants/paths';

import UserCard from '../UserCard/UserCard';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
  subHeader: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    zIndex: 0,
  },
  title: {
    fontWeight: 500,
  },
}));

const WhoToFollow = ({ session }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [popUpEntered, setPopUpEntered] = useState(false);
  const [nameEntered, setNameEntered] = useState(false);
  const [username, setUsername] = useState('');

  const { data, error, loading, refetch } = useQuery(
    GET_WHO_TO_FOLLOW,
    {
      variables: { limit: 3 },
    },
  );
  const {
    data: refetchFollowersData,
    loading: refetchFollowersLoading,
  } = useQuery(GET_REFETCH_FOLLOWERS);

  useEffect(() => {
    refetch();
  }, [signal, session?.me]);

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

  //console.log(refetchFollowersData, error);

  if (!data || loading || refetchFollowersLoading)
    return <CircularProgress color="inherit" />;

  const { whoToFollow } = data;
  const {
    refetchFollowers: { signal },
  } = refetchFollowersData;

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
    setUsername(user.username);
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

  const popperOpen = Boolean(anchorEl);
  return (
    <>
      <Popper
        open={popperOpen}
        anchorEl={anchorEl}
        placement="bottom"
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <UserCard
              onMouseEnter={handlePopUpMouseEnter}
              onMouseLeave={handlePopUpMouseLeave}
              username={username}
              session={session}
            />
          </Fade>
        )}
      </Popper>
      <List
        subheader={
          <ListSubheader className={classes.subHeader}>
            <Typography variant="body1" className={classes.title}>
              Who to follow
            </Typography>
          </ListSubheader>
        }
        className={classes.root}
      >
        {whoToFollow.map((user, index) => {
          return (
            <Fragment key={index}>
              <ListItem alignItems="center">
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
                      component={RouterLink}
                      to={`/${user.username}`}
                      color="textPrimary"
                      onMouseEnter={e => handleMouseEnter(e, user)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {user.name}
                    </Link>
                  }
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      color="textSecondary"
                      display="block"
                    >
                      {`@${user.username}`}
                    </Typography>
                  }
                />
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
              </ListItem>
              {index !== 2 && (
                <Divider variant="inset" component="li" />
              )}
            </Fragment>
          );
        })}
      </List>
    </>
  );
};

export default WhoToFollow;
