import { StatusBar } from "expo-status-bar";
import { PlatformColor, StyleSheet, View, useColorScheme } from "react-native";
import { Game } from "./src/Game";

export default function App() {
  return (
    <View style={styles.container}>
      <Game />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PlatformColor("secondarySystemBackground"),
  },
});
