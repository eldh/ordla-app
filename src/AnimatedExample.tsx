import * as React from "react";
import { Button, StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
  withDelay,
} from "react-native-reanimated";
import { BouncyBox } from "./BouncyBox";

export function AnimatedExample(props: {}) {
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const bounceRef = React.useRef<{ bounce(): void }>();

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
      }}
    >
      <BouncyBox style={styles.box} ref={bounceRef} />
      <Button
        title="start"
        onPress={() => {
          bounceRef.current?.bounce();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 80,
    height: 80,
    alignSelf: "center",
    margin: 50,
    borderRadius: 15,
    backgroundColor: "#006ae2",
  },
});
