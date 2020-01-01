import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';

import Autoplay from '../components/Autoplay/Autoplay';
import WhoToFollow from '../components/WhoToFollow/WhoToFollow';
import Messages from '../components/Messages/Messages';

import withAuthorization from '../session/withAuthorization';

const useStyles = makeStyles(theme => ({
  card: { width: '100%' },
  media: {
    height: 170,
  },
  large: {
    width: 150,
    height: 150,
    border: '3px solid #ffffff',
    bottom: 0,
    position: 'relative',
    left: 12,
    top: 70,
    alignItems: 'center',
  },
  content: {
    paddingTop: 50,
  },
  username: {
    fontWeight: 'bold',
  },
  numbers: {
    textAlign: 'center',
  },
  numbersSection: {
    paddingTop: 10,
  },
}));

const AccountPage = () => {
  const classes = useStyles();

  return (
    <Grid
      container
      spacing={2}
      justify="center"
      direction="row-reverse"
    >
      <Grid
        item
        container
        md={4}
        sm={6}
        xs={12}
        className={classes.item}
        spacing={2}
        direction="column"
      >
        <Grid item>
          <Autoplay />
        </Grid>
        <Grid item>
          <WhoToFollow />
        </Grid>
      </Grid>
      <Grid
        item
        container
        direction="column"
        spacing={2}
        md={8}
        sm={6}
        xs={12}
        className={classes.item}
      >
        <Grid item>
          <Card className={classes.card} elevation={0} square>
            <CardMedia
              className={classes.media}
              image="https://images.unsplash.com/photo-1470549638415-0a0755be0619"
              title="Contemplative Reptile"
            >
              <Avatar
                src="https://i.pinimg.com/originals/0a/dd/87/0add874e1ea0676c4365b2dd7ddd32e3.jpg"
                className={classes.large}
              />
            </CardMedia>
            <CardContent className={classes.content}>
              <Typography
                className={classes.username}
                variant="h6"
                component="p"
              >
                Username
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                component="p"
              >
                @screen_name
              </Typography>
              <Grid
                container
                className={classes.numbersSection}
                justify="space-between"
              >
                <Grid item className={classes.numbers}>
                  <Typography
                    variant="h4"
                    color="primary"
                    component="h4"
                  >
                    23
                  </Typography>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    component="p"
                  >
                    Messages
                  </Typography>
                </Grid>
                <Grid item className={classes.numbers}>
                  <Typography
                    variant="h4"
                    color="primary"
                    component="h4"
                  >
                    23
                  </Typography>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    component="p"
                  >
                    Followers
                  </Typography>
                </Grid>
                <Grid item className={classes.numbers}>
                  <Typography
                    variant="h4"
                    color="primary"
                    component="h4"
                  >
                    23
                  </Typography>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    component="p"
                  >
                    Following
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Messages limit={2} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withAuthorization(session => session && session.me)(
  AccountPage,
);
