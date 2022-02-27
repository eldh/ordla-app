import { StyleProp, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import * as React from "react";
import { useBounce } from "./useBounce";

export const BouncyBox = React.forwardRef(function BouncyBox(
  props: { style: StyleProp<object> },
  ref
) {
  const { bounce, style } = useBounce();
  React.useImperativeHandle(ref, () => ({
    bounce,
  }));
  return <Animated.View style={StyleSheet.compose(props.style, style)} />;
});
