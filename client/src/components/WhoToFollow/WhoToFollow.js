import React, { Fragment } from 'react';
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

import { GET_USERS } from '../../graphql/queries';
import { FOLLOW_USER, UNFOLLOW_USER } from '../../graphql/mutations';
import { UPLOADS_IMAGES_FOLDER } from '../../constants/paths';

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

  const { data, error, loading, refetch } = useQuery(GET_USERS, {
    variables: { limit: 3 },
  });

  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);

  // console.log(data, error);
  if (loading) return <CircularProgress color="inherit" />;
  const { users } = data;

  const amIFollowing = user =>
    !!user.followers.find(
      user => user.username === session?.me?.username,
    );
  const amIFollowed = user =>
    !!user.following.find(
      user => user.username === session.me?.username,
    );

  const handleFollow = async user => {
    await followUser({ variables: { username: user.username } });
    refetch();
    if (accountRefetch) accountRefetch();
  };
  const handleUnfollow = async user => {
    await unfollowUser({ variables: { username: user.username } });
    refetch();
    if (accountRefetch) accountRefetch();
  };

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
      {users.map((user, index) => {
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
                  <Link
                    component={RouterLink}
                    to={`/${user.username}`}
                    color="textPrimary"
                  >
                    {user.name}
                  </Link>
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
