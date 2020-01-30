import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    marginTop: theme.spacing(8),
  },
  flex: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

function Loading() {
  const classes = useStyles();

  return (
    <div className={classes.flex}>
      <CircularProgress />
    </div>
  );
}

export default Loading;

/*
    <Backdrop className={classes.backdrop} open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
*/
