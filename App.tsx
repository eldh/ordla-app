import { StatusBar } from "expo-status-bar";
import { PlatformColor, StyleSheet, View, useColorScheme } from "react-native";
import { Game } from "./src/Game";
import { darkTheme, lightTheme, ThemeProvider } from "./src/Theme";

export default function App() {
  const theme = useColorScheme() === "dark" ? darkTheme : lightTheme;
  return (
    <ThemeProvider value={theme}>
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <Game key={theme.bg} />
        <StatusBar style="auto" />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
