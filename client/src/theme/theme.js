import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import lightGreen from '@material-ui/core/colors/lightGreen';
import red from '@material-ui/core/colors/red';

const themeType = 'light';
const themeVariable = {
  type: themeType === 'light' ? 'light' : 'dark',
  background:
    themeType === 'light' ? { default: 'rgb(230, 236, 240)' } : {},
};

const theme = createMuiTheme({
  palette: {
    type: themeVariable.type,
    primary: {
      // light: will be calculated from palette.primary.main,
      main: lightGreen['A400'], // '#ff4400' orange
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    background: themeVariable.background,
    secondary: {
      // light: blue['A200'], // '#0066ff'
      main: red['A400'], // '#0044ff'
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

console.log(theme);

export default theme;
