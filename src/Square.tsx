import * as React from "react";
import { PlatformColor, StyleProp, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Text } from "./Text";
import {
  darkTheme,
  lightTheme,
  themeColor,
  useIsDarkMode,
  useShadowStyle,
  useTheme,
} from "./Theme";

export function Square(props: {
  letter?: string;
  index: number;
  guess?: string;
  isCurrentTry: boolean;
  word: string;
}) {
  const { index, letter, word, isCurrentTry, guess } = props;
  const shadowStyle = useShadowStyle("shadow2");
  const isDarkMode = useIsDarkMode();
  const hit = !isCurrentTry && word[index] === letter;
  const letterOccurrances = word.split("").filter((l) => l === letter).length;
  const letterHitsElsewhere =
    (!hit &&
      guess?.split("").filter((l2, i) => word[i] === l2 && l2 === letter)
        .length) ||
    0;

  const naiveAlmost =
    letter !== undefined &&
    !isCurrentTry &&
    !hit &&
    (letterOccurrances > 1
      ? letterHitsElsewhere < letterOccurrances
      : letterHitsElsewhere === 0) &&
    word.indexOf(letter) > -1;

  const numberOfOccurrencesInGuess =
    guess?.split("").filter((l) => l === letter).length ?? 0;

  const indicesOfOccurrencesInGuess =
    guess?.split("").map((l) => (l === letter ? 1 : 0)) || [];

  const numberOfOccurrencesInWord = word
    .split("")
    .filter((l) => l === letter).length;

  let couldBeExtranousAlmost =
    naiveAlmost && numberOfOccurrencesInGuess > numberOfOccurrencesInWord;

  let isExtranousAlmost = couldBeExtranousAlmost;
  const almost = Boolean(naiveAlmost && !isExtranousAlmost);
  if (couldBeExtranousAlmost) {
    let count = numberOfOccurrencesInWord;
    for (let j = 0; j < 5; j++) {
      let v = indicesOfOccurrencesInGuess[j];
      if (v === 1) {
        count = count - 1;
        if (count < 0) {
          indicesOfOccurrencesInGuess[j] = 0;
        }
      }
    }
    isExtranousAlmost = indicesOfOccurrencesInGuess[index] !== 1;
  }

  let letterAnimationStyle = useTypingAnimation();
  const bgStyle = useColorAnimation({ hit, almost, index });
  const rotateStyle = useRotateAnimation({ isCurrentTry, index, letter });

  return (
    <Animated.View
      style={StyleSheet.compose(styles.container, [
        rotateStyle,
        isCurrentTry ? letterAnimationStyle : bgStyle,
        shadowStyle,
      ])}
    >
      {letter ? (
        <Text style={styles.text} shadow={isDarkMode}>
          {letter}
        </Text>
      ) : null}
    </Animated.View>
  );
}

export function EmptySquare() {
  const shadowStyle = useShadowStyle("shadow2");
  return <View style={StyleSheet.compose(styles.container, [shadowStyle])} />;
}

function useTypingAnimation() {
  const themeFactor = useIsDarkMode() ? -10 : 10;
  const animationValue = useSharedValue(themeFactor);

  const style = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animationValue.value,
      [-10, -9, -8, 10, 11, 12],
      [
        darkTheme.bg1,
        darkTheme.bg3,
        darkTheme.bg2,
        lightTheme.bg1,
        "#eaeaea",
        lightTheme.bg3,
      ] as any
    );

    return {
      backgroundColor,
    };
  });

  const bounce = React.useCallback(() => {
    animationValue.value = withSequence(
      withTiming(themeFactor + 1, {
        duration: 10,
        easing: Easing.elastic(1),
      }),
      withTiming(themeFactor + 2, {
        duration: 250,
        easing: Easing.out(Easing.ease),
      })
    );
  }, []);
  React.useEffect(() => {
    bounce();
  }, []);

  return style;
}

function useColorAnimation({
  hit,
  almost,
  index,
}: {
  hit: boolean;
  almost: boolean;
  index: number;
}) {
  const themeFactor = useTheme() === darkTheme ? -10 : 10;
  const bgAnimation = useSharedValue(themeFactor + (hit ? 1 : almost ? -1 : 0));
  const shouldAnimate = React.useRef(false);
  React.useEffect(() => {
    if (!shouldAnimate.current) {
      shouldAnimate.current = true;
    } else if (shouldAnimate.current && (hit || almost)) {
      bgAnimation.value = withDelay(
        index * REVEAL_DELAY + REVEAL_DELAY / 2,
        withTiming(themeFactor + (hit ? 1 : almost ? -1 : 0), {
          duration: REVEAL_DELAY / 4,
        })
      );
    }
  }, [hit, almost]);

  return useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      bgAnimation.value,
      [-11, -10, -9, 9, 10, 11],
      [
        darkTheme.orange,
        darkTheme.bg2,
        darkTheme.green,
        lightTheme.orange,
        lightTheme.bg3,
        lightTheme.green,
      ] as any
    );

    return {
      backgroundColor,
    };
  });
}

function useRotateAnimation({
  isCurrentTry,
  index,
  letter,
}: {
  isCurrentTry: boolean;
  index: number;
  letter: string | undefined;
}) {
  const rotation = useSharedValue(0);
  const style = useAnimatedStyle(() => {
    return {
      transform: [{ rotateX: `${rotation.value}deg` }],
    };
  });

  const shouldAnimate = React.useRef(false);
  React.useEffect(() => {
    if (letter && isCurrentTry) {
      shouldAnimate.current = true;
    } else if (shouldAnimate.current && !isCurrentTry) {
      rotation.value = withDelay(
        index * REVEAL_DELAY,
        withSequence(
          withTiming(90, {
            duration: REVEAL_DELAY / 2,
            easing: Easing.linear,
          }),
          withTiming(0, {
            duration: REVEAL_DELAY / 2,
            easing: Easing.linear,
          })
        )
      );
    }
  }, [isCurrentTry, letter]);
  return style;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themeColor("bg1"),
    height: 50,
    width: 50,
    margin: 2,
    borderRadius: 6,
  },
  text: {
    textTransform: "uppercase",
    color: themeColor("text"),
    fontWeight: "600",
    fontSize: 20,
  },
});
const REVEAL_DELAY = 200;
