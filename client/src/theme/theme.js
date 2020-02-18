import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import deepOrange from '@material-ui/core/colors/deepOrange';
import lightBlue from '@material-ui/core/colors/lightBlue';

const getThemeFn = (type, color) => {
  const themeVariable = {
    type: type === 'light' ? 'light' : 'dark',
    background:
      type === 'light' ? { default: 'rgb(230, 236, 240)' } : {},
    primaryMain:
      color === 'green' ? green['A400'] : deepOrange['A400'],
    secondaryMain:
      color === 'green' ? red['A400'] : lightBlue['A400'],
  };

  const theme = createMuiTheme({
    palette: {
      type: themeVariable.type,
      primary: {
        // light: will be calculated from palette.primary.main,
        main: themeVariable.primaryMain, //lightGreen['A400'], // '#ff4400' orange
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
      },
      background: themeVariable.background,
      secondary: {
        // light: blue['A200'], // '#0066ff'
        main: themeVariable.secondaryMain, //red['A400'], // '#0044ff'
        // dark: will be calculated from palette.secondary.main,
        // contrastText: '#ffcc00',
      },
      // Used by `getContrastText()` to maximize the contrast between
      // the background and the text.
      contrastThreshold: 3,
      // Used by the functions below to shift a color's luminance by approximately
      // two indexes within its tonal palette.
      // E.g., shift from Red 500 to Red 300 or Red 700.
      tonalOffset: 0.2,
    },
  });

  // console.log(theme);
  return theme;
};

export default getThemeFn;
