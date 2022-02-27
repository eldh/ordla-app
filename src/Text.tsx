import {
  PlatformColor,
  StyleProp,
  StyleSheet,
  Text as RNText,
} from "react-native";

export function H3({ children, style }: Props) {
  return <Text style={StyleSheet.compose(styles.h3, style)}>{children}</Text>;
}
export function H2({ children, style }: Props) {
  return <Text style={StyleSheet.compose(styles.h2, style)}>{children}</Text>;
}
export function B({ children, style }: Props) {
  return <Text style={StyleSheet.compose(styles.b, style)}>{children}</Text>;
}
export function Text({ children, style, shadow }: Props) {
  return (
    <RNText
      style={StyleSheet.compose(styles.text, [style, shadow && styles.shadow])}
    >
      {children}
    </RNText>
  );
}
const styles = StyleSheet.create({
  text: {
    color: PlatformColor("label"),
  },
  h2: {
    color: PlatformColor("label"),
    textTransform: "uppercase",
    fontSize: 48,
    fontWeight: "800",
    letterSpacing: 4,
  },
  h3: {
    color: PlatformColor("label"),
    textTransform: "uppercase",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 1,
  },
  shadow: {
    textShadowColor: "#000000b0",
    textShadowRadius: 1,
    textShadowOffset: { width: 0, height: 1 },
  },
  b: {
    fontWeight: "800",
  },
});

interface Props {
  children: string;
  style?: StyleProp<object>;
  shadow?: boolean;
}
