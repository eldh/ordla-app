import { PlatformColor, Pressable, StyleSheet, Text, View } from "react-native";

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
    backgroundColor: PlatformColor("systemBlue"),
    paddingTop: 10,
    paddingLeft: 14,
    paddingRight: 14,
    paddingBottom: 10,
    borderRadius: 13,
    flexGrow: 0,
    flex: 0,
    flexShrink: 0,
    alignSelf: "center",
  },
  text: {
    color: "#ffffff",
    textAlign: "left",
    fontWeight: "normal",
    fontSize: 17,
  },
  pressed: {
    opacity: 0.7,
  },
});
