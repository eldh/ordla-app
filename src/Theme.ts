import * as React from "react";

export const lightTheme: Theme = {
  bg: "#ffffff",
  bg1: "#eeeeee",
  bg2: "#dddddd",
  bg3: "#bbbbbb",
  text: "#222222",
  text1: "#555555",
  text2: "#888888",
  green: "#00b200",
  orange: "#df9800",
};

export const darkTheme: Theme = {
  bg: "#222222",
  bg1: "#383838",
  bg2: "#5a5a5a",
  bg3: "#606060",
  text: "#ffffff",
  text1: "#dddddd",
  text2: "#999999",
  green: "#00b200",
  orange: "#df9800",
};

type Theme = {
  bg: string;
  bg1: string;
  bg2: string;
  bg3: string;
  text: string;
  text1: string;
  text2: string;
  green: string;
  orange: string;
};
const ThemeContext = React.createContext(darkTheme);

export const ThemeProvider = ThemeContext.Provider;

export function useTheme() {
  return React.useContext(ThemeContext);
}
