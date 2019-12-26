import React from 'react';
import { Router, Route } from 'react-router-dom';

import Navigation from './components/Navigation/Navigation';
import LandingPage from './pages/Landing/Landing';
import SignUpPage from './pages/SignUp/SignUp';
import SignInPage from './pages/SignIn/SignIn';
import AccountPage from './pages/Account/Account';
import AdminPage from './pages/Admin/Admin';
import withSession from './session/withSession';

import * as routes from './constants/routes';
import history from './constants/history';

const App = ({ session, refetch }) => (
  <Router history={history}>
    <div>
      <Navigation session={session} />

      <hr />

      <Route
        exact
        path={routes.LANDING}
        component={() => <LandingPage />}
      />
      <Route
        exact
        path={routes.SIGN_UP}
        component={() => <SignUpPage refetch={refetch} />}
      />
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
    </div>
  </Router>
);

export default withSession(App);
