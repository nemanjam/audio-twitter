import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { ThemeProvider } from '@material-ui/styles';
import { GET_THEME } from '../graphql/queries';

const withTheme = getThemeFn => Component => props => {
  const { data, error, loading } = useQuery(GET_THEME);

  if (loading) return '';

  const {
    theme: { type, color },
  } = data;

  const theme = getThemeFn(type, color);

  return (
    <ThemeProvider theme={theme}>
      <Component {...props} />
    </ThemeProvider>
  );
};

export default withTheme;
