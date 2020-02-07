import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';

import { UPLOADS_IMAGES_FOLDER } from '../../constants/paths';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  secondaryAction: {
    top: '27%',
  },
}));

const UsersTab = ({ users }) => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
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
    </List>
  );
};

export default UsersTab;
