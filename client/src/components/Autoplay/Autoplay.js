import React, { useEffect } from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import Slider from '@material-ui/core/Slider';
import { Typography } from '@material-ui/core';
import { useMutation } from '@apollo/react-hooks';
import { UPDATE_AUTOPLAY } from '../../graphql/mutations';

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
    zIndex: 0,
  },
  title: {
    fontWeight: 500,
  },
  slider: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}));

const marks = [
  {
    value: 5,
    label: '5s',
  },
  {
    value: 10,
    label: '10s',
  },
  {
    value: 15,
    label: '15s',
  },
  {
    value: 20,
    label: '20s',
  },
];

const Autoplay = ({ setMainAutoplay }) => {
  const classes = useStyles();
  const [autoplay, setAutoplay] = React.useState('none');
  const [sliderValue, setSliderValue] = React.useState(5);
  const [updateAutoplay] = useMutation(UPDATE_AUTOPLAY, {
    variables: {
      direction: autoplay,
      createdAt: moment().toISOString(),
      duration: sliderValue,
    },
  });

  useEffect(() => {
    updateAutoplay();
  }, [autoplay, sliderValue]);

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

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
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
      <ListItem className={classes.slider}>
        <Typography gutterBottom>
          Play first {sliderValue} seconds
        </Typography>
        <Slider
          marks={marks}
          step={null}
          value={sliderValue}
          onChange={handleSliderChange}
          min={5}
          max={20}
        />
      </ListItem>
    </List>
  );
};

export default Autoplay;
