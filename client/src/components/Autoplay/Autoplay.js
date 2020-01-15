import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import WifiIcon from '@material-ui/icons/Wifi';
import BluetoothIcon from '@material-ui/icons/Bluetooth';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import FastForwardIcon from '@material-ui/icons/FastForward';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
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

const Autoplay = ({ setMainAutoplay }) => {
  const classes = useStyles();
  const [autoplay, setAutoplay] = React.useState('none');

  useEffect(() => {
    if (setMainAutoplay) setMainAutoplay(autoplay);
  }, [autoplay]);

  const toggleAutoplay = value => {
    if (autoplay === 'none') {
      setAutoplay(value);
    } else if (value === autoplay) {
      setAutoplay('none');
    } else if (value === 'existing') {
      if (autoplay === 'existing') {
        setAutoplay('incoming');
      } else {
        setAutoplay('existing');
      }
    } else {
      if (autoplay === 'incoming') {
        setAutoplay('existing');
      } else {
        setAutoplay('incoming');
      }
    }
  };

  return (
    <List
      subheader={
        <ListSubheader className={classes.subHeader}>
          <Typography variant="body1" className={classes.title}>
            Autoplay: {autoplay}
          </Typography>
        </ListSubheader>
      }
      className={classes.root}
    >
      <ListItem>
        <ListItemIcon>
          <VolumeUpIcon />
        </ListItemIcon>
        <ListItemText primary="Autoplay existing" />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            onChange={() => toggleAutoplay('existing')}
            checked={autoplay === 'existing'}
            color="primary"
          />
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <VolumeUpIcon />
        </ListItemIcon>
        <ListItemText primary="Autoplay incoming" />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            onChange={() => toggleAutoplay('incoming')}
            checked={autoplay === 'incoming'}
            color="primary"
          />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
};

export default Autoplay;
