import {
  PlatformColor,
  StyleProp,
  StyleSheet,
  Text as RNText,
} from "react-native";

export function H3({ children, style, ...etc }: Props) {
  return (
    <Text style={StyleSheet.compose(styles.h3, style)} {...etc}>
      {children}
    </Text>
  );
}
export function H2({ children, style, ...etc }: Props) {
  return (
    <Text style={StyleSheet.compose(styles.h2, style)} {...etc}>
      {children}
    </Text>
  );
}
export function H1({ children, style, ...etc }: Props) {
  return (
    <Text style={StyleSheet.compose(styles.h1, style)} {...etc}>
      {children}
    </Text>
  );
}
export function Title({ children, style, ...etc }: Props) {
  return (
    <Text style={StyleSheet.compose(styles.title, style)} {...etc}>
      {children}
    </Text>
  );
}
export function B({ children, style, ...etc }: Props) {
  return (
    <Text style={StyleSheet.compose(styles.b, style)} {...etc}>
      {children}
    </Text>
  );
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
  title: {
    color: PlatformColor("label"),
    textTransform: "uppercase",
    fontSize: 48,
    fontWeight: "800",
    letterSpacing: 4,
  },
  h1: {
    color: PlatformColor("label"),
    fontSize: 34,
    lineHeight: 41,
    fontWeight: "800",
    letterSpacing: 0.4,
  },

  h2: {
    color: PlatformColor("label"),
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    letterSpacing: 1,
  },
  h3: {
    color: PlatformColor("label"),
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
    letterSpacing: 0.2,
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
