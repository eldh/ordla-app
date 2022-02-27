import { StyleProp, StyleSheet } from "react-native";

import {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
  withDelay,
} from "react-native-reanimated";
import * as React from "react";

export function useBounce(config: { delay?: number } = {}) {
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bounce = React.useCallback(() => {
    scale.value = withDelay(
      config.delay ?? 0,
      withSequence(
        withTiming(1.15, {
          duration: 20,
          easing: Easing.elastic(1),
        }),
        withTiming(1, { duration: 350, easing: Easing.out(Easing.ease) })
      )
    );
  }, []);

  return { bounce, style };
}
