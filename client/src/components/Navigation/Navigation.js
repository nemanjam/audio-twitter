import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SettingsIcon from '@material-ui/icons/Settings';
import { styled } from '@material-ui/core/styles';

import * as routes from '../../constants/routes';
import SignOutButton from '../SignOutButton/SignOutButton';

const StyledLink = styled(Link)({
  minHeight: 64,
});

const TabPanel = props => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </Typography>
  );
};

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  title: {
    marginRight: theme.spacing(2),
    fontWeight: 700,
  },
  flex: {
    flex: 1,
  },
  label: {
    color: 'white',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'space-around',
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.75,
    letterSpacing: '0.02857em',
  },
  typographyLabel: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.75,
    letterSpacing: '0.02857em',
    marginLeft: theme.spacing(1),
  },
  indicator: {
    backgroundColor: 'white',
  },
}));

const Navigation = ({ session, page }) => {
  const classes = useStyles();
  const [random, setRandom] = useState(0);

  const pages = ['', 'profile', 'notifications', 'admin'];

  let active = pages.indexOf(page);
  active === -1 ? (active = 0) : (active = active);

  useEffect(() => {
    setRandom(Math.random());
  }, []);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <CameraIcon className={classes.icon} />
          <Typography
            variant="h6"
            color="inherit"
            className={classes.title}
            noWrap
          >
            Audio Twitter
          </Typography>

          <Button
            color="inherit"
            component={Link}
            to={routes.LANDING}
          >
            Landing
          </Button>
          {session && session.me && (
            <Button
              color="inherit"
              component={Link}
              to={session.me.username}
            >
              Account
            </Button>
          )}
          {session && session.me && session.me.role === 'ADMIN' && (
            <Button
              color="inherit"
              component={Link}
              to={routes.ADMIN}
            >
              Admin
            </Button>
          )}

          <Tabs
            value={active}
            textColor="primary"
            classes={{ indicator: classes.indicator }}
          >
            <Tab
              component={StyledLink}
              to={`/${pages[0]}`}
              label={
                <div className={classes.label}>
                  <HomeIcon />
                  <Typography
                    className={classes.typographyLabel}
                    display="inline"
                  >
                    Home
                  </Typography>
                </div>
              }
            />
            <Tab
              component={StyledLink}
              to={`/${pages[1]}`}
              label={
                <div className={classes.label}>
                  <AccountCircleIcon />
                  <Typography
                    className={classes.typographyLabel}
                    display="inline"
                  >
                    Profile
                  </Typography>
                </div>
              }
            />
            <Tab
              component={StyledLink}
              to={`/${pages[2]}`}
              label={
                <div className={classes.label}>
                  <NotificationsIcon />
                  <Typography
                    className={classes.typographyLabel}
                    display="inline"
                  >
                    Notifications
                  </Typography>
                </div>
              }
            />
            <Tab
              component={StyledLink}
              to={`/${pages[3]}`}
              label={
                <div className={classes.label}>
                  <SettingsIcon />
                  <Typography
                    className={classes.typographyLabel}
                    display="inline"
                  >
                    Admin
                  </Typography>
                </div>
              }
            />
          </Tabs>

          <div className={classes.flex}></div>
          {session && session.me ? (
            <>
              <SignOutButton />
              <Typography variant="caption" color="inherit" noWrap>
                ({session.me.username})
              </Typography>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to={routes.SIGN_UP}
              >
                Sign Up
              </Button>
              <Button
                color="inherit"
                component={Link}
                to={routes.SIGN_IN}
              >
                Sign In
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navigation;
