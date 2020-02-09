import React, { Fragment } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { GET_FRIENDS } from '../../graphql/queries';
import { UPLOADS_IMAGES_FOLDER } from '../../constants/paths';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  secondaryAction: {
    top: '27%',
  },
  noUsers: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
}));

const UsersTab = ({ username, isFollowers, isFollowing }) => {
  const classes = useStyles();

  const { data, error, loading, refetch } = useQuery(GET_FRIENDS, {
    variables: { username, isFollowers, isFollowing, limit: 10 },
  });

  // console.log(data, error);
  if (loading) return <CircularProgress color="inherit" />;
  const { friends: users } = data;

  return (
    <List className={classes.root}>
      {users.length === 0 && (
        <div className={classes.noUsers}>There are no users ...</div>
      )}
      <>
        {users.map((user, index) => {
          return (
            <Fragment key={index}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar
                    alt={user.name}
                    src={`${UPLOADS_IMAGES_FOLDER}${user.avatar.path}`}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={user.name}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="textSecondary"
                      >
                        @{user.username}
                      </Typography>
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                        display="block"
                      >
                        {user.bio}
                      </Typography>
                    </React.Fragment>
                  }
                />
                <ListItemSecondaryAction
                  className={classes.secondaryAction}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                  >
                    Follow
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
              {index !== users.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </Fragment>
          );
        })}
      </>
    </List>
  );
};

export default UsersTab;
