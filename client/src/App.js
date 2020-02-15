import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';

import LandingPage from './pages/Landing';
import SignUpPage from './pages/SignUp';
import SignInPage from './pages/SignIn';
import AccountPage from './pages/Account';
import AdminPage from './pages/Admin';
import NotFoundPage from './pages/NotFound';
import NotificationsPage from './pages/Notifications';
import RouteWithLayout from './pages/RouteWithLayout';
import Layout from './pages/Layout';
import withSession from './session/withSession';

import * as routes from './constants/routes';

const App = ({ session, refetch }) => (
  <BrowserRouter>
    <Switch>
      <RouteWithLayout
        path={routes.LANDING}
        component={LandingPage}
        componentProps={{ session }}
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
        path={routes.ADMIN}
        component={AdminPage}
        layout={Layout}
        layoutProps={{ session }}
      />
      <RouteWithLayout
        path={routes.NOTIFICATIONS}
        component={NotificationsPage}
        layout={Layout}
        layoutProps={{ session }}
      />
      <RouteWithLayout
        path={routes.NOTFOUND}
        component={NotFoundPage}
        layout={Layout}
        layoutProps={{ session }}
        exact
      />
      <RouteWithLayout
        path={routes.USERNAME}
        component={AccountPage}
        componentProps={{ session }}
        layout={Layout}
        layoutProps={{ session }}
        exact
      />
    </Switch>
  </BrowserRouter>
);

//samo ovde withSession, pa niz tree
export default withSession(App);
