import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

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
import Badge from '@material-ui/core/Badge';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { styled } from '@material-ui/core/styles';

import * as routes from '../../constants/routes';
import SignOutButton from '../SignOutButton/SignOutButton';
import { SET_THEME } from '../../graphql/mutations';

const StyledLink = styled(Link)({
  minHeight: 64,
  minWidth: 'auto',
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
    color: theme.palette.primary.contrastText,
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
    backgroundColor: theme.palette.primary.contrastText,
  },
  tabs: {
    maxWidth: 1000,
  },
}));

const Navigation = ({ session, match }) => {
  const classes = useStyles();
  const [random, setRandom] = useState(0);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [setTheme] = useMutation(SET_THEME);

  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = async (type, color) => {
    await setTheme({
      variables: {
        type,
        color,
      },
    });
    setAnchorEl(null);
  };

  const getActiveTabIndex = match => {
    if (!session?.me) return false;
    if (match?.params?.username === session?.me?.username) return 1;
    if (match?.url === '/') return 0;
    if (match?.url === '/notifications') return 2;
    if (match?.url === '/admin') return 3;
    return false;
  };
  //console.log(match);

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
          <Tabs
            value={getActiveTabIndex(match)}
            textColor="primary"
            classes={{ indicator: classes.indicator }}
            className={classes.tabs}
          >
            <Tab
              component={StyledLink}
              to={routes.LANDING}
              label={
                <div className={classes.label}>
                  <Badge
                    className={classes.margin}
                    badgeContent={10}
                    color="secondary"
                  >
                    <HomeIcon />
                  </Badge>
                  <Typography
                    className={classes.typographyLabel}
                    display="inline"
                  >
                    Home
                  </Typography>
                </div>
              }
            />
            {session?.me && [
              <Tab
                key={0}
                component={StyledLink}
                to={`/${session?.me?.username}`}
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
              />,
              <Tab
                key={1}
                component={StyledLink}
                to={routes.NOTIFICATIONS}
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
              />,
            ]}
            {session?.me?.role === 'ADMIN' && (
              <Tab
                component={StyledLink}
                to={routes.ADMIN}
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
            )}
          </Tabs>
          <div className={classes.flex}></div>
          <Button
            color="inherit"
            startIcon={<Brightness4Icon />}
            onClick={handleMenuOpen}
          >
            Theme
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={e => handleMenu('light', 'green')}>
              Light green
            </MenuItem>
            <MenuItem onClick={e => handleMenu('light', 'orange')}>
              Light orange
            </MenuItem>
            <MenuItem onClick={e => handleMenu('dark', 'green')}>
              Dark green
            </MenuItem>
            <MenuItem onClick={e => handleMenu('dark', 'orange')}>
              Dark orange
            </MenuItem>
          </Menu>
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
