import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';

import Navigation from './components/Navigation/Navigation';
import LandingPage from './pages/Landing/Landing';
import SignUpPage from './pages/SignUp/SignUp';
import SignInPage from './pages/SignIn/SignIn';
import AccountPage from './pages/Account/Account';
import AdminPage from './pages/Admin/Admin';
import RouteWithLayout from './pages/RouteWithLayout/RouteWithLayout';
import Layout from './pages/Layout/Layout';
import withSession from './session/withSession';

import * as routes from './constants/routes';
// import history from './constants/history';

const App = ({ session, refetch }) => (
  <BrowserRouter>
    <Switch>
      {/* <Navigation session={session} /> */}

      <RouteWithLayout
        path={routes.LANDING}
        component={LandingPage}
        layout={Layout}
        layoutProps={{ session }}
        exact
      />
      <RouteWithLayout
        path={routes.SIGN_UP}
        component={SignUpPage}
        componentProps={{ refetch }}
        layout={Layout}
        layoutProps={{ session }}
      />
      <RouteWithLayout
        path={routes.SIGN_IN}
        component={SignInPage}
        componentProps={{ refetch }}
        layout={Layout}
        layoutProps={{ session }}
      />
      <RouteWithLayout
        path={routes.ACCOUNT}
        component={AccountPage}
        layout={Layout}
        layoutProps={{ session }}
      />
      <RouteWithLayout
        path={routes.ADMIN}
        component={AdminPage}
        layout={Layout}
        layoutProps={{ session }}
      />
      {/* 
      <Route
        exact
        path={routes.SIGN_IN}
        component={() => <SignInPage refetch={refetch} />}
      />
      <Route
        exact
        path={routes.ACCOUNT}
        component={() => <AccountPage />}
      />
      <Route
        exact
        path={routes.ADMIN}
        component={() => <AdminPage />}
      />
       */}
    </Switch>
  </BrowserRouter>
);

export default withSession(App);
