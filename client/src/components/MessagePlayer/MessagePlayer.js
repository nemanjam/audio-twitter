import React, { useEffect, useRef, useState } from 'react';
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

import {
  UPDATE_AUTOPLAY,
  LIKE_MESSAGE,
  UNLIKE_MESSAGE,
  REPOST_MESSAGE,
  UNREPOST_MESSAGE,
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

  // console.log(message);

  const [updateAutoplay] = useMutation(UPDATE_AUTOPLAY, {
    variables: { direction, createdAt, duration },
  });

  const {
    data: { messagesVariables },
  } = useQuery(GET_MESSAGES_VARIABLES);
  //console.log(messagesVariables);

  const [likeMessage] = useMutation(LIKE_MESSAGE, {
    variables: { messageId: id },
    update: (cache, { data }) => {
      const oldData = cache.readQuery({
        query: GET_PAGINATED_MESSAGES_WITH_USERS,
      });
      const message = oldData.messages.edges.find(m => m.id === id);
      message.isLiked = data.likeMessage;
      message.likesCount++;

      const index = oldData.messages.edges.findIndex(
        m => m.id === id,
      );

      const newData = {
        messages: {
          ...oldData.messages,
          edges: [
            ...oldData.messages.edges.slice(0, index),
            message,
            ...oldData.messages.edges.slice(index + 1),
          ],
          pageInfo: {
            ...oldData.messages.pageInfo,
          },
        },
      };

      cache.writeQuery({
        query: GET_PAGINATED_MESSAGES_WITH_USERS,
        data: newData,
      });
    },
  });

  const [unlikeMessage] = useMutation(UNLIKE_MESSAGE, {
    variables: { messageId: id },
    update: (cache, { data }) => {
      const oldData = cache.readQuery({
        query: GET_PAGINATED_MESSAGES_WITH_USERS,
      });
      const message = oldData.messages.edges.find(m => m.id === id);
      message.isLiked = !data.unlikeMessage;
      message.likesCount--;

      const index = oldData.messages.edges.findIndex(
        m => m.id === id,
      );

      const newData = {
        messages: {
          ...oldData.messages,
          edges: [
            ...oldData.messages.edges.slice(0, index),
            message,
            ...oldData.messages.edges.slice(index + 1),
          ],
          pageInfo: {
            ...oldData.messages.pageInfo,
          },
        },
      };
      cache.writeQuery({
        query: GET_PAGINATED_MESSAGES_WITH_USERS,
        data: newData,
      });
    },
  });

  const handleLike = async () => {
    if (message.isLiked) {
      const unliked = await unlikeMessage();
    } else {
      const liked = await likeMessage();
    }
    setReloadWaveSurfer(Math.random());
  };

  const [repostMessage] = useMutation(REPOST_MESSAGE, {
    variables: { messageId: id },
    refetchQueries: () => [
      {
        query: GET_PAGINATED_MESSAGES_WITH_USERS,
        variables: messagesVariables,
      },
    ],
  });
  const [unrepostMessage] = useMutation(UNREPOST_MESSAGE, {
    variables: { messageId: id },
    refetchQueries: () => [
      {
        query: GET_PAGINATED_MESSAGES_WITH_USERS,
        variables: messagesVariables,
      },
    ],
  });

  const handleRepost = async () => {
    if (message.isRepostedByMe) {
      const unreposted = await unrepostMessage();
    } else {
      const reposted = await repostMessage();
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
  }, [play, playerReady, duration]);

  useEffect(() => {
    if (wavesurfer.current) {
      wavesurfer.current.load(path);
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

    wavesurfer.current.load(path);
    // wavesurfer.current.on('loading', percentage => {
    //   console.log('percentage', percentage);
    // });

    const readyHandler = () => {
      setPlayerReady(true);
    };
    const playHandler = () => {
      setIsPlaying(true);
    };
    const pauseHandler = () => {
      setIsPlaying(false);
    };

    wavesurfer.current.on('ready', readyHandler);
    wavesurfer.current.on('play', playHandler);
    wavesurfer.current.on('pause', pauseHandler);

    return () => {
      wavesurfer.current.un('ready', readyHandler);
      wavesurfer.current.un('play', playHandler);
      wavesurfer.current.un('pause', pauseHandler);
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
      <ListItem className={classes.root}>
        <Grid container direction="column">
          {message.isReposted && (
            <Grid item className={classes.repost}>
              <RepeatIcon className={classes.repostIcon} />
              <Typography
                variant="body2"
                color="textSecondary"
                display="inline"
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
                      <IconButton>
                        <DeleteIcon className={classes.icon} />
                      </IconButton>
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

export default MessagePlayer;
