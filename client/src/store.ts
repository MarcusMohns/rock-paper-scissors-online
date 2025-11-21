import {
  indigo,
  green,
  lightGreen,
  amber,
  pink,
  purple,
  deepPurple,
  blue,
  red,
  blueGrey,
  grey,
  lightBlue,
  cyan,
  orange,
  deepOrange,
  lime,
} from "@mui/material/colors";
import { v4 as uuidv4 } from "uuid";

const storedUser = localStorage.getItem("user");
export const defaultUser =
  storedUser === null
    ? {
        name: "unnamed",
        id: uuidv4(),
        socketId: "0",
        color: "red",
        themePreference: "light",
        stats: {
          wins: 0,
          losses: 0,
          draws: 0,
          rating: 1000,
        },
      }
    : JSON.parse(storedUser);

export const colors = [
  green[500],
  lightGreen[500],
  lime[700],
  cyan[200],
  indigo[500],
  blue[700],
  lightBlue[500],
  blueGrey[600],
  deepPurple[500],
  purple[500],
  pink[500],
  grey[500],
  red[500],
  deepOrange[500],
  orange[500],
  amber[500],
];

export default colors;
