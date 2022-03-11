import { DynamicColorIOS, Pressable, StyleSheet, Text } from "react-native";
import { darkTheme, lightTheme } from "./Theme";

export function Button(props: { title: string; onPress: () => void }) {
  const { onPress } = props;
  return (
    <Pressable
      style={({ pressed }) => [styles.base, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Text style={styles.text}>{props.title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: DynamicColorIOS({
      light: lightTheme.bg2,
      dark: darkTheme.bg2,
    }),
    paddingTop: 10,
    paddingLeft: 14,
    paddingRight: 14,
    paddingBottom: 10,
    borderRadius: 13,
    flexGrow: 0,
    flex: 0,
    flexShrink: 0,
    alignSelf: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.7,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  text: {
    color: DynamicColorIOS({
      light: lightTheme.text1,
      dark: darkTheme.text1,
    }),
    textAlign: "left",
    fontWeight: "600",
    fontSize: 17,
  },
  pressed: {
    opacity: 0.7,
  },
});
