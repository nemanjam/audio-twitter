import React, { useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
  GET_USER,
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
    maxWidth: 255,
    textAlign: 'left',
    zIndex: 5,
  },
  media: {
    height: 110,
    position: 'relative',
    paddingTop: '11%',
  },
  avatar: {
    width: 112,
    height: 112,
    left: 12,
    border: '2px solid #ffffff',
    position: 'absolute',
  },
  follow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  nameDiv: {
    marginBottom: theme.spacing(1),
  },
  name: {
    fontWeight: 'bold',
  },
  followers: {
    display: 'flex',
    alignItems: 'center',
  },
  followersNumber: {
    fontWeight: 'bold',
    marginRight: theme.spacing(1),
  },
}));

const UserCard = ({ session, username, ...rest }) => {
  const classes = useStyles();

  const { data, error, loading, refetch } = useQuery(GET_USER, {
    variables: { username },
  });

  const {
    data: {
      refetchFollowers: { signal },
    },
  } = useQuery(GET_REFETCH_FOLLOWERS);

  useEffect(() => {
    refetch();
  }, [signal]);

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

  if (loading) return <CircularProgress color="inherit" />;
  const { user } = data;

  return (
    <Card className={classes.root} elevation={6} square {...rest}>
      <CardMedia
        className={classes.media}
        image={`${UPLOADS_IMAGES_FOLDER}${user.cover.path}`}
      >
        <Avatar
          className={classes.avatar}
          src={`${UPLOADS_IMAGES_FOLDER}${user.avatar.path}`}
        />
      </CardMedia>
      <CardContent>
        <div className={classes.follow}>
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
        </div>
        <div className={classes.nameDiv}>
          <Typography variant="body1" className={classes.name}>
            {user.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            @{user.username}
          </Typography>
        </div>
        <Typography
          variant="body1"
          color="textSecondary"
          gutterBottom
        >
          {`${user.bio.substring(0, 54)}...`}
        </Typography>
        <div className={classes.followers}>
          <Typography
            variant="body1"
            className={classes.followersNumber}
          >
            {user.followersCount}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            style={{ marginRight: 16 }}
          >
            Followers
          </Typography>
          <Typography
            variant="body1"
            className={classes.followersNumber}
          >
            {user.followingCount}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Following
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
