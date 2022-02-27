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
import { useUpdateEffect } from "./useUpdateEffect";

export function Square(props: {
  letter?: string;
  index: number;
  guess?: string;
  isCurrentTry: boolean;
  word: string;
}) {
  const { index, letter, word, isCurrentTry, guess } = props;

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

  let letterAnimationStyle = useTypingAnimation(letter);
  const bgStyle = useColorAnimation({ hit, almost, index });
  const rotateStyle = useRotateAnimation({ isCurrentTry, index, letter });

  return (
    <Animated.View
      style={StyleSheet.compose(styles.container, [
        bgStyle,
        rotateStyle,
        isCurrentTry ? letterAnimationStyle : (undefined as StyleProp<object>),
      ])}
    >
      {letter ? (
        <Text style={styles.text} shadow>
          {letter}
        </Text>
      ) : null}
    </Animated.View>
  );
}

export function EmptySquare() {
  return <View style={styles.container} />;
}

function useTypingAnimation(letter?: string) {
  const animationValue = useSharedValue(0);

  const style = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animationValue.value,
      [0, 1],
      ["#333333", "#888888"]
    );

    return {
      backgroundColor,
    };
  });

  const bounce = React.useCallback(() => {
    animationValue.value = withSequence(
      withTiming(0.3, {
        duration: 10,
        easing: Easing.elastic(1),
      }),
      withTiming(0, { duration: 250, easing: Easing.out(Easing.ease) })
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
  const bgAnimation = useSharedValue(hit ? 1 : almost ? -1 : 0);

  const shouldAnimate = React.useRef(false);
  React.useEffect(() => {
    if (!shouldAnimate.current) {
      shouldAnimate.current = true;
    } else if (shouldAnimate.current && (hit || almost)) {
      bgAnimation.value = withDelay(
        index * REVEAL_DELAY + REVEAL_DELAY / 2,
        withTiming(hit ? 1 : almost ? -1 : 0, { duration: REVEAL_DELAY / 4 })
      );
    }
  }, [hit, almost]);

  return useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      bgAnimation.value,
      [-1, 0, 1],
      ["#ee33ee", "#333333", "#33aa33"]
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
    backgroundColor: PlatformColor("tertiarySystemBackground"),
    height: 50,
    margin: 2,
    borderRadius: 6,
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    width: 50,
    shadowOffset: { width: 0, height: 2 },
  },
  text: {
    textTransform: "uppercase",
    color: PlatformColor("label"),
    fontWeight: "600",
    fontSize: 20,
  },
  almost: {
    backgroundColor: PlatformColor("systemOrange"),
  },
  hit: {
    backgroundColor: PlatformColor("systemGreen"),
  },
  miss: {
    backgroundColor: PlatformColor("secondarySystemBackground"),
  },
});
const REVEAL_DELAY = 200;
