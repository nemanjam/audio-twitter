import React from 'react';
import { Redirect } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { GET_ME } from './queries';
import { resetWebsocket } from '../index';

const withSession = Component => props => {
  const { data, loading, error, refetch } = useQuery(GET_ME);

  if (loading) {
    return null;
  }
  console.log('withSession', data);
  // if (error) {
  //   localStorage.removeItem('token');
  // }

  return <Component {...props} session={data} refetch={refetch} />;
};

export default withSession;
