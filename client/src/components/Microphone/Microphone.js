import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { ReactMic } from 'react-mic';
import WaveSurfer from 'wavesurfer.js';
import { useMutation } from '@apollo/react-hooks';

import { makeStyles } from '@material-ui/core/styles';
import MicIcon from '@material-ui/icons/Mic';
import IconButton from '@material-ui/core/IconButton';
import StopIcon from '@material-ui/icons/Stop';
import ReplayIcon from '@material-ui/icons/Replay';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import DoneIcon from '@material-ui/icons/Done';
import CancelIcon from '@material-ui/icons/Cancel';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import { green, red, blue } from '@material-ui/core/colors';
import Fab from '@material-ui/core/Fab';

import ErrorMessage from '../Error/Error';
import { CREATE_MESSAGE } from '../../graphql/mutations';

import './microphone.css';

const useStyles = makeStyles(theme => ({
  icon: {
    height: 38,
    width: 38,
  },
  reactmic: {
    width: '100%',
    height: 200,
  },
  wavesurfer: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 2,
  },
}));

export default function Microphone() {
  const [record, setRecord] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [tempFile, setTempFile] = React.useState(null);

  const [playerReady, setPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const wavesurfer = useRef(null);

  const [createMessage, { error }] = useMutation(CREATE_MESSAGE);

  useEffect(() => {
    if (!open || (open && !tempFile)) return;

    wavesurfer.current = WaveSurfer.create({
      container: '#wavesurfer-id',
      waveColor: 'grey',
      progressColor: 'tomato',
      height: 140,
      cursorWidth: 1,
      cursorColor: 'lightgrey',
      barWidth: 2,
      normalize: true,
      responsive: true,
      fillParent: true,
    });

    wavesurfer.current.on('ready', () => {
      setPlayerReady(true);
    });

    wavesurfer.current.on('play', () => setIsPlaying(true));
    wavesurfer.current.on('pause', () => setIsPlaying(false));
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [open, tempFile]);

  const handleResize = useCallback(() => {
    wavesurfer.current.util.debounce(() => {
      wavesurfer.current.empty();
      wavesurfer.current.drawBuffer();
    }, 150);
  });

  useEffect(() => {
    if (tempFile && wavesurfer.current) {
      wavesurfer.current.load(tempFile.blobURL);
    } else {
      wavesurfer.current = null;
      setTempFile(null);
    }
  }, [tempFile]);

  const togglePlayback = () => {
    if (!isPlaying) {
      wavesurfer.current.play();
    } else {
      wavesurfer.current.pause();
    }
  };
  const stopPlayback = () => wavesurfer.current.stop();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const BlobURLToFile = async tempFile => {
    const response = await fetch(tempFile.blobURL);
    const data = await response.blob();
    const metadata = {
      type: 'audio/webm',
    };
    const file = new File([data], 'mic_recording.webm', metadata);
    return file;
  };

  const handleDone = async () => {
    if (tempFile) {
      try {
        const file = await BlobURLToFile(tempFile);
        await createMessage({
          variables: { file },
        });
        setTempFile(null);
        setRecord(false);
        setOpen(false);
      } catch (error) {}
    }
  };

  const handleCancel = () => {
    setRecord(false);
    setTempFile(null);
    setOpen(false);
  };

  const startRecording = () => {
    setTempFile(null);
    setRecord(true);
  };

  const stopRecording = () => {
    setRecord(false);
  };

  const onData = recordedBlob => {
    //console.log("chunk of real-time data is: ", recordedBlob);
  };

  const onStop = recordedBlob => {
    setTempFile(recordedBlob);
  };

  const classes = useStyles();

  return (
    <>
      <Grid container justify="center">
        <Grid item>
          <Fab
            color="primary"
            className={classes.fab}
            onClick={handleClickOpen}
          >
            <MicIcon className={classes.icon} />
          </Fab>
        </Grid>
      </Grid>
      <Dialog maxWidth="sm" open={open} onClose={handleCancel}>
        <DialogTitle className={classes.flex}>Record</DialogTitle>
        <DialogContent>
          {tempFile ? (
            <div className={classes.wavesurfer} id="wavesurfer-id" />
          ) : (
            <ReactMic
              record={record}
              className={classes.reactmic}
              onStop={onStop}
              onData={onData}
              strokeColor="grey"
              backgroundColor="white"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Grid container>
            {tempFile && (
              <Grid item container justify="center" xs={12}>
                {!isPlaying ? (
                  <IconButton onClick={togglePlayback}>
                    <PlayArrowIcon className={classes.icon} />
                  </IconButton>
                ) : (
                  <IconButton onClick={togglePlayback}>
                    <PauseIcon className={classes.icon} />
                  </IconButton>
                )}
                <IconButton onClick={stopPlayback}>
                  <StopIcon className={classes.icon} />
                </IconButton>
              </Grid>
            )}
            <Grid item container justify="center" xs={12}>
              {!record && !tempFile && (
                <IconButton onClick={startRecording}>
                  <FiberManualRecordIcon
                    style={{ color: red[500] }}
                    className={classes.icon}
                  />
                </IconButton>
              )}

              {!record && tempFile && (
                <IconButton onClick={startRecording}>
                  <ReplayIcon className={classes.icon} />
                </IconButton>
              )}

              {record && (
                <IconButton onClick={stopRecording}>
                  <StopIcon className={classes.icon} />
                </IconButton>
              )}

              <IconButton onClick={handleDone}>
                <DoneIcon
                  style={
                    tempFile && !record ? { color: green[500] } : {}
                  }
                  className={classes.icon}
                />
              </IconButton>
              <IconButton onClick={handleCancel}>
                <CancelIcon
                  style={
                    tempFile && !record ? { color: red[500] } : {}
                  }
                  className={classes.icon}
                />
              </IconButton>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </>
  );
}
