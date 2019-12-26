import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_ME } from './queries';

const withSession = Component => props => {
  const { data, refetch } = useQuery(GET_ME);
  return <Component {...props} session={data} refetch={refetch} />;
};

export default withSession;
