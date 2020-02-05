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
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';

import { GET_WHO_TO_FOLLOW } from '../../graphql/queries';
import { FOLLOW_USER, UNFOLLOW_USER } from '../../graphql/mutations';
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
  },
  title: {
    fontWeight: 500,
  },
}));

const WhoToFollow = ({ session, accountRefetch }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [overPopup, setOverPopup] = useState(false);

  const { data, error, loading, refetch } = useQuery(
    GET_WHO_TO_FOLLOW,
    {
      variables: { limit: 3 },
    },
  );

  useEffect(() => {
    refetch();
  }, [session?.me]);

  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);

  // console.log(data, error);
  if (loading) return <CircularProgress color="inherit" />;
  const { whoToFollow } = data;

  const amIFollowing = user =>
    !!user.followers.find(
      user => user.username === session?.me?.username,
    );
  const amIFollowed = user =>
    !!user.following.find(
      user => user.username === session?.me?.username,
    );

  const handleFollow = async user => {
    await followUser({ variables: { username: user.username } });
    if (accountRefetch) accountRefetch();
    refetch();
  };
  const handleUnfollow = async user => {
    await unfollowUser({ variables: { username: user.username } });
    if (accountRefetch) accountRefetch();
    refetch();
  };
  const handleMouseEnter = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleMouseLeave = event => {};

  const handlePopUpMouseEnter = event => {
    setOverPopup(true);
  };
  const handlePopUpMouseLeave = event => {
    setOverPopup(false);
    setTimeout(() => {
      setAnchorEl(null);
    }, 500);
  };

  const popOverOpen = Boolean(anchorEl);
  return (
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
                <Link component={RouterLink} to={`/${user.username}`}>
                  <Avatar
                    alt={user.name}
                    src={`${UPLOADS_IMAGES_FOLDER}${user.avatar.path}`}
                  />
                </Link>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <>
                    <Link
                      component={RouterLink}
                      to={`/${user.username}`}
                      color="textPrimary"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      {user.name}
                    </Link>
                    <Popover
                      open={popOverOpen}
                      anchorEl={anchorEl}
                      onClose={() => {
                        setAnchorEl(null);
                      }}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                    >
                      <UserCard
                        onMouseEnter={handlePopUpMouseEnter}
                        onMouseLeave={handlePopUpMouseLeave}
                      />
                    </Popover>
                  </>
                }
                secondary={
                  <Typography
                    component="span"
                    variant="body2"
                    color="textPrimary"
                    display="block"
                  >
                    {`@${user.username}`}
                  </Typography>
                }
              />
              {amIFollowing(user) ? (
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
  );
};

export default WhoToFollow;
