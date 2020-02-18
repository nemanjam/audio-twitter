import React, { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';
import WaveSurfer from 'wavesurfer.js';
import uuidv4 from 'uuid/v4';
import { useMutation, useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import { Link as RouterLink } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import DeleteIcon from '@material-ui/icons/Delete';
import RepeatIcon from '@material-ui/icons/Repeat';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { green, red, blue } from '@material-ui/core/colors';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTheme } from '@material-ui/styles';
import PauseIcon from '@material-ui/icons/Pause';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import Link from '@material-ui/core/Link';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';

import UserCard from '../UserCard/UserCard';
import * as routes from '../../constants/routes';

import {
  UPDATE_AUTOPLAY,
  LIKE_MESSAGE,
  UNLIKE_MESSAGE,
  REPOST_MESSAGE,
  UNREPOST_MESSAGE,
  DELETE_MESSAGE,
  SET_REFETCH_FOLLOWERS,
} from '../../graphql/mutations';

import {
  GET_PAGINATED_MESSAGES_WITH_USERS,
  GET_ALL_MESSAGES_WITH_USERS,
  GET_MESSAGES_VARIABLES,
} from '../../graphql/queries';

import {
  UPLOADS_AUDIO_FOLDER,
  UPLOADS_IMAGES_FOLDER,
} from '../../constants/paths';

const faces = [
  'http://i.pravatar.cc/300?img=5',
  'http://i.pravatar.cc/300?img=2',
  'http://i.pravatar.cc/300?img=3',
  'http://i.pravatar.cc/300?img=4',
];

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 240,
    backgroundColor: theme.palette.background.paper,
  },
  wavesurfer: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  buttons: {
    paddingTop: theme.spacing(1),
  },
  controls: {
    minWidth: '100px',
  },
  icon: {
    height: 18,
    width: 18,
  },
  avatar: {
    display: 'inline-block',
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  avatarItem: {
    paddingRight: theme.spacing(1),
  },
  bold: {
    //fontWeight: 500,
  },
  repost: {
    paddingLeft: theme.spacing(6),
    paddingBottom: 5,
  },
  repostIcon: {
    color: theme.palette.text.secondary,
    fontSize: 14,
    marginRight: theme.spacing(1),
    verticalAlign: 'middle',
  },
  popper: { zIndex: 4 },
  reposter: {
    cursor: 'pointer',
  },
}));

const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

function MessagePlayer({
  direction,
  duration,
  play,
  session,
  message,
  history,
}) {
  const theme = useTheme();
  const { createdAt, user, file, id } = message;
  const { username, name } = user;
  const path = `${UPLOADS_AUDIO_FOLDER}${file.path}`;
  const avatar = `${UPLOADS_IMAGES_FOLDER}${user.avatar.path}`;

  const wavesurfer = useRef(null);

  const [playerReady, setPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const wavesurferId = `wavesurfer--${uuidv4()}`;
  const newIndex = useRef(0);
  const [reloadWaveSurfer, setReloadWaveSurfer] = useState(0);

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

  const handleMouseEnter = (event, username) => {
    setAnchorEl(event.currentTarget);
    setNameEntered(true);
    setUsernameState(username);
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
  // console.log(message);

  const [updateAutoplay] = useMutation(UPDATE_AUTOPLAY, {
    variables: { direction, createdAt, duration },
  });

  const {
    data: { messagesVariables },
  } = useQuery(GET_MESSAGES_VARIABLES);
  //console.log(messagesVariables);

  const refetchQueries = () => [
    {
      query: GET_PAGINATED_MESSAGES_WITH_USERS,
      variables: messagesVariables,
    },
  ];
  const [setRefetchFollowers] = useMutation(SET_REFETCH_FOLLOWERS);

  const [deleteMessage] = useMutation(DELETE_MESSAGE, {
    variables: { messageId: id },
    refetchQueries,
  });

  const [likeMessage] = useMutation(LIKE_MESSAGE, {
    variables: { messageId: id },
    refetchQueries,
  });

  const [unlikeMessage] = useMutation(UNLIKE_MESSAGE, {
    variables: { messageId: id },
    refetchQueries,
  });

  const [repostMessage] = useMutation(REPOST_MESSAGE, {
    variables: { messageId: id },
    refetchQueries,
  });
  const [unrepostMessage] = useMutation(UNREPOST_MESSAGE, {
    variables: { messageId: id },
    refetchQueries,
  });

  const handleRepost = async () => {
    if (!session?.me) {
      history.push(routes.SIGN_IN);
    }
    if (message.isRepostedByMe) {
      await unrepostMessage();
    } else {
      await repostMessage();
    }
    setRefetchFollowers();
  };

  const handleDelete = async () => {
    await deleteMessage();
    setRefetchFollowers();
  };

  const handleLike = async () => {
    if (!session?.me) {
      history.push(routes.SIGN_IN);
    }

    if (message.isLiked) {
      const unliked = await unlikeMessage();
    } else {
      const liked = await likeMessage();
    }
    setReloadWaveSurfer(Math.random());
  };

  // console.log(message);
  const prevDuration = usePrevious(duration);

  useEffect(() => {
    if (
      !wavesurfer.current ||
      !playerReady ||
      prevDuration !== duration
    )
      return;

    if (play) {
      wavesurfer.current.play();
      setTimeout(() => {
        wavesurfer.current.stop();
        updateAutoplay();
      }, duration * 1000);
    } else {
      wavesurfer.current.stop();
    }

    const finishHandler = () => {
      if (play) {
        updateAutoplay();
      }
    };

    wavesurfer.current.on('finish', finishHandler);

    return () => {
      wavesurfer.current.un('finish', finishHandler);
    };
  }, [play, playerReady, duration, prevDuration, updateAutoplay]);

  useEffect(() => {
    const readyHandler = () => {
      setPlayerReady(true);
    };
    const playHandler = () => {
      setIsPlaying(true);
    };
    const pauseHandler = () => {
      setIsPlaying(false);
    };

    if (wavesurfer.current) {
      wavesurfer.current.load(path);
      wavesurfer.current.on('ready', readyHandler);
      wavesurfer.current.on('play', playHandler);
      wavesurfer.current.on('pause', pauseHandler);
      return () => {
        wavesurfer.current.unAll();
      };
    }

    wavesurfer.current = WaveSurfer.create({
      container: `#${wavesurferId}`,
      waveColor: `${theme.palette.text.secondary}`,
      progressColor: `${theme.palette.secondary.main}`,
      cursorColor: `${theme.palette.text.primary}`,
      height: 70,
      cursorWidth: 1,
      barWidth: 2,
      normalize: true,
      responsive: true,
      fillParent: true,
    });
    //console.log('path', path);

    wavesurfer.current.load(path);
    // wavesurfer.current.on('loading', percentage => {
    //   console.log('percentage', percentage);
    // });

    wavesurfer.current.on('ready', readyHandler);
    wavesurfer.current.on('play', playHandler);
    wavesurfer.current.on('pause', pauseHandler);

    return () => {
      wavesurfer.current.unAll();
    };
  }, [theme, path]);

  const togglePlayback = () => {
    if (!isPlaying) {
      wavesurfer.current.play();
    } else {
      wavesurfer.current.pause();
    }
  };
  const stopPlayback = () => wavesurfer.current.stop();

  const classes = useStyles();

  let transportPlayButton;

  if (!isPlaying) {
    transportPlayButton = (
      <IconButton onClick={togglePlayback}>
        <PlayArrowIcon className={classes.icon} />
      </IconButton>
    );
  } else {
    transportPlayButton = (
      <IconButton onClick={togglePlayback}>
        <PauseIcon className={classes.icon} />
      </IconButton>
    );
  }

  return (
    <>
      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement="bottom"
        transition
        className={classes.popper}
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

      <ListItem className={classes.root}>
        <Grid container direction="column">
          {message.isReposted && (
            <Grid item className={classes.repost}>
              <RepeatIcon className={classes.repostIcon} />
              <Typography
                variant="body2"
                color="textSecondary"
                display="inline"
                onMouseEnter={e =>
                  handleMouseEnter(
                    e,
                    message?.repost?.reposter?.username,
                  )
                }
                onMouseLeave={handleMouseLeave}
                className={classes.reposter}
              >
                {`${message?.repost?.reposter?.name} reposted this message`}
              </Typography>
            </Grid>
          )}
          <Grid container item>
            <Grid item className={classes.avatarItem}>
              <Link component={RouterLink} to={`/${username}`}>
                <Avatar className={classes.avatar} src={avatar} />
              </Link>
            </Grid>
            <Grid item container className={classes.flex}>
              <Grid item>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  className={classes.bold}
                  display="inline"
                >
                  <Link
                    component={RouterLink}
                    to={`/${username}`}
                    color="inherit"
                    onMouseEnter={e => handleMouseEnter(e, username)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {name}
                  </Link>
                </Typography>
                <Typography display="inline"> · </Typography>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  display="inline"
                >
                  {`@${username}`}
                </Typography>
                <Typography display="inline"> · </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  display="inline"
                >
                  {moment(
                    message.isReposted
                      ? message.repost.originalMessage.createdAt
                      : createdAt,
                  ).fromNow()}
                </Typography>
              </Grid>
              <Grid container direction="column">
                <Grid
                  item
                  id={wavesurferId}
                  className={classes.wavesurfer}
                />
                {!playerReady && (
                  <CircularProgress
                    style={{
                      position: 'absolute',
                      top: '50px',
                      right: '50%',
                    }}
                  />
                )}
                <Grid
                  item
                  container
                  justify="space-between"
                  className={classes.buttons}
                >
                  <Grid item container sm={5} xs={12} spacing={1}>
                    <Grid item>{transportPlayButton}</Grid>
                    <Grid item>
                      <IconButton onClick={stopPlayback}>
                        <StopIcon className={classes.icon} />
                      </IconButton>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    container
                    sm={7}
                    xs={12}
                    justify="space-between"
                  >
                    <Grid item>
                      <IconButton onClick={handleLike}>
                        <FavoriteIcon
                          style={
                            message.isLiked ? { color: red[500] } : {}
                          }
                          className={classes.icon}
                        />
                      </IconButton>
                      {message.likesCount > 0 && (
                        <Typography
                          display="inline"
                          variant="body2"
                          color="textSecondary"
                        >
                          {message.likesCount}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item>
                      <IconButton onClick={handleRepost}>
                        <RepeatIcon
                          style={
                            message.isRepostedByMe
                              ? { color: green[500] }
                              : {}
                          }
                          className={classes.icon}
                        />
                      </IconButton>
                      {message.repostsCount > 0 && (
                        <Typography
                          display="inline"
                          variant="body2"
                          color="textSecondary"
                        >
                          {message.repostsCount}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item>
                      {message?.user?.id === session?.me?.id && (
                        <IconButton onClick={handleDelete}>
                          <DeleteIcon className={classes.icon} />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ListItem>
    </>
  );
}

export default withRouter(MessagePlayer);
