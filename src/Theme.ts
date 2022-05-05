import * as React from "react";
import { ColorValue, DynamicColorIOS, ShadowStyleIOS } from "react-native";

export const lightTheme: Theme = {
  bg: "#f0f0f0",
  bg1: "#dfdfdf",
  bg2: "#fbfbfb",
  bg3: "#ffffff",
  text: "#222222",
  text1: "#444444",
  text2: "#888888",
  green: "#72ec60",
  orange: "#ffe343",
  shadow1: {
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  shadow2: {
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  shadow3: {
    shadowColor: "#000000",
    shadowOpacity: 0.7,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
  },
};

export const darkTheme: Theme = {
  bg: "#222222",
  bg1: "#383838",
  bg2: "#505050",
  bg3: "#606060",
  text: "#ffffff",
  text1: "#dddddd",
  text2: "#999999",
  green: "#00b200",
  orange: "#df9800",
  shadow1: {
    shadowColor: "#000000",
    shadowOpacity: 0.7,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  shadow2: {
    shadowColor: "#000000",
    shadowOpacity: 0.6,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  shadow3: {
    shadowColor: "#000000",
    shadowOpacity: 0.7,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
  },
};

type Theme = {
  bg: ColorValue;
  bg1: ColorValue;
  bg2: ColorValue;
  bg3: ColorValue;
  text: ColorValue;
  text1: ColorValue;
  text2: ColorValue;
  green: ColorValue;
  orange: ColorValue;
  shadow1: ShadowStyleIOS;
  shadow2: ShadowStyleIOS;
  shadow3: ShadowStyleIOS;
};
const ThemeContext = React.createContext(darkTheme);

export const ThemeProvider = ThemeContext.Provider;

export function useTheme() {
  return React.useContext(ThemeContext);
}
type ShadowLevel = "shadow1" | "shadow2" | "shadow3";
export function themeColor(color: keyof Omit<Theme, ShadowLevel>) {
  return DynamicColorIOS({ light: lightTheme[color], dark: darkTheme[color] });
}

export function useShadowStyle(level: ShadowLevel): object {
  return useTheme()[level];
}

export function useIsDarkMode(): boolean {
  return useTheme() === darkTheme;
}
