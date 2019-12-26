import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import { Redirect } from 'react-router-dom';

import * as routes from '../constants/routes';
import { GET_ME } from './queries';

// withAuthorization(condition)(Component)(props)
// hoc fja koja prima komponentu kao arg ili vraca

const withAuthorization = conditionFn => Component => props => {
  const { data, loading } = useQuery(GET_ME);

  if (loading) {
    return null;
  }

  return conditionFn(data) ? (
    <Component {...props} />
  ) : (
    <Redirect to={routes.SIGN_IN} />
  );
};

export default withAuthorization;
