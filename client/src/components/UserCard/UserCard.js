import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 285,
    textAlign: 'left',
    zIndex: 2,
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

const UserCard = ({ ...rest }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root} elevation={0} square {...rest}>
      <CardMedia
        className={classes.media}
        image="https://images.unsplash.com/photo-1470549638415-0a0755be0619?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
        title="Contemplative Reptile"
      >
        <Avatar
          className={classes.avatar}
          src="https://images.unsplash.com/photo-1456379771252-03388b5adf1a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
        />
      </CardMedia>
      <CardContent>
        <div className={classes.follow}>
          <Button variant="outlined" size="small" color="primary">
            Follow
          </Button>
        </div>
        <div className={classes.nameDiv}>
          <Typography variant="body1" className={classes.name}>
            Maria Garcia
          </Typography>
          <Typography variant="body2" color="textSecondary">
            @marymary
          </Typography>
        </div>
        <Typography
          variant="body1"
          color="textSecondary"
          gutterBottom
        >
          Lizards are a widespread group of squamate reptiles...
        </Typography>
        <div className={classes.followers}>
          <Typography
            variant="body1"
            className={classes.followersNumber}
          >
            123
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
            234
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
