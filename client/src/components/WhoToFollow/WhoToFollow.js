import React from 'react';
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

const WhoToFollow = () => {
  const classes = useStyles();

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
      <ListItem alignItems="center">
        <ListItemAvatar>
          <Avatar
            alt="Remy Sharp"
            src="http://i.pravatar.cc/300?img=4"
          />
        </ListItemAvatar>
        <ListItemText
          primary="Username"
          secondary={
            <Typography
              component="span"
              variant="body2"
              color="textPrimary"
              display="block"
            >
              @screen_name
            </Typography>
          }
        />
        <Button variant="outlined" color="primary">
          Follow
        </Button>
      </ListItem>
      <Divider variant="inset" component="li" />

      <ListItem alignItems="center">
        <ListItemAvatar>
          <Avatar
            alt="Remy Sharp"
            src="http://i.pravatar.cc/300?img=4"
          />
        </ListItemAvatar>
        <ListItemText
          primary="Username"
          secondary={
            <Typography
              component="span"
              variant="body2"
              color="textPrimary"
              display="block"
            >
              @screen_name
            </Typography>
          }
        />
        <Button color="primary" variant="outlined">
          Follow
        </Button>
      </ListItem>
      <Divider variant="inset" component="li" />

      <ListItem alignItems="center">
        <ListItemAvatar>
          <Avatar
            alt="Remy Sharp"
            src="http://i.pravatar.cc/300?img=4"
          />
        </ListItemAvatar>
        <ListItemText
          primary="Username"
          secondary={
            <Typography
              component="span"
              variant="body2"
              color="textPrimary"
              display="block"
            >
              @screen_name
            </Typography>
          }
        />
        <Button color="primary" variant="outlined">
          Follow
        </Button>
      </ListItem>
    </List>
  );
};

export default WhoToFollow;
