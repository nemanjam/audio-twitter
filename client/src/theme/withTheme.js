import React from 'react';
import { ThemeProvider } from '@material-ui/styles';

const withTheme = theme => Component => props => {
  // console.log(theme);
  return (
    <ThemeProvider theme={theme}>
      <Component {...props} />
    </ThemeProvider>
  );
};

export default withTheme;
