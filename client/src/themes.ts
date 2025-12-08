import { green, lightGreen, amber, blueGrey, grey } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
export const darkTheme = createTheme({
  typography: {
    fontFamily: "Nunito, monospace, Segoe UI,Raleway",
    fontSize: 14,
    fontWeightRegular: 600,
    fontWeightBold: 800,
  },
  palette: {
    contrastThreshold: 4.5,
    mode: "dark",
    background: {
      default: grey[900],
      paper: blueGrey[900],
    },
    primary: {
      main: blueGrey[800],
      light: blueGrey[700],
      dark: blueGrey[900],
    },
    secondary: {
      main: grey[700],
      light: grey[500],
      dark: grey[800],
    },
    info: {
      main: grey[200],
      light: grey[100],
      dark: grey[400],
    },
    success: {
      main: green[700],
      light: green[500],
      dark: green[800],
      contrastText: "#fff",
    },
  },
});

export const lightTheme = createTheme({
  typography: {
    fontFamily: "Nunito, monospace, Segoe UI,Raleway",
    fontSize: 14,
    fontWeightRegular: 600,
    fontWeightBold: 800,
  },
  palette: {
    contrastThreshold: 4.5,
    mode: "light",

    background: {
      default: "#fff",
      paper: amber[50],
    },
    primary: {
      main: amber[100],
      light: amber[50],
      dark: amber[200],
      contrastText: "#000",
    },
    secondary: {
      main: amber[300],
      light: amber[200],
      dark: amber[500],
      contrastText: "#000",
    },
    info: {
      main: grey[800],
      light: grey[700],
      dark: grey[900],
    },
    success: {
      main: lightGreen[400],
      light: lightGreen[300],
      dark: lightGreen[600],
      contrastText: "#000",
    },
  },
});
