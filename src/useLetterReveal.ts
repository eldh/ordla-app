import { PlatformColor, StyleProp, StyleSheet } from "react-native";

import {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
  withDelay,
  interpolateColor,
  useDerivedValue,
} from "react-native-reanimated";

export function useLetterReveal(config: { hit: boolean; almost: boolean }) {
  const progress = useDerivedValue(() => {
    return withTiming(config.hit ? 1 : 0);
  });

  const style = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ["#333333", "#33ff33"]
    );

    return {
      backgroundColor,
    };
  });

  return { animate: () => {}, style };
}
