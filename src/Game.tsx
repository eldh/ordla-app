import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { PlatformColor, SafeAreaView, StyleSheet } from "react-native";
import { Text, Title } from "./Text";
import { Help } from "./Help";
import { Keyboard } from "./Keyboard";
import { ResultsLink } from "./ResultsLink";
import { SummaryModal } from "./SummaryModal";
import { Tries } from "./Tries";
import { usePersistedState } from "./usePersistedState";
import { useTimer } from "./useTimer";
import { words } from "./words";
import { useUpdateEffect } from "./useUpdateEffect";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { Button } from "./Button";
import { themeColor, themeShadow } from "./Theme";

export function Game() {
  const [, endOfDay] = useTimer(10000);
  const word = useMemo(() => {
    return getWordForDay(endOfDay);
  }, [endOfDay]);
  const [tries, setTries, triesLoaded] = usePersistedState<string[]>(
    "tries_" + word,
    []
  );
  const [, setResults, resultsLoaded] = usePersistedState<object>(
    "results",
    {}
  );

  return (
    <WordGame
      key={word && triesLoaded && resultsLoaded ? "loaded" : "temp"}
      word={word}
      tries={tries}
      setTries={setTries}
      setResults={setResults}
    />
  );
}
function WordGame({
  word,
  tries,
  setTries,
  setResults,
}: {
  word: string;
  tries: string[];
  setTries: StateCallback<string[]>;
  setResults: StateCallback<object>;
}) {
  const [currentTry, setCurrentTry] = useState("");
  const [showNonExistingWordWarning, setShowNonExistingWordWarning] =
    useState(false);
  const hasWon = useMemo(() => tries[tries.length - 1] === word, [tries, word]);
  const hasLost = useMemo(() => !hasWon && tries.length === 6, [tries, hasWon]);

  const [showModal, setShowModal] = useState(hasWon || hasLost);
  const [modalWasShown, setModalWasShown] = useState(showModal);
  useEffect(() => {
    if (showNonExistingWordWarning) {
      const v = setTimeout(() => {
        setShowNonExistingWordWarning(false);
      }, 2000);
      return () => clearTimeout(v);
    }
  }, [showNonExistingWordWarning]);
  useEffect(() => {
    if (hasWon || hasLost) {
      setResults((r) => ({ ...r, [word]: hasLost ? -1 : tries.length }));
    }
  }, [hasWon, hasLost]);

  useLayoutEffect(() => {
    if (hasWon || hasLost) {
      let t = setTimeout(() => {
        setShowModal(true);
        setTimeout(() => setModalWasShown(true), 500);
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [hasWon, hasLost]);

  useUpdateEffect(() => {
    setShowModal(false);
    setCurrentTry("");
  }, [word]);

  const handlePress = useCallback(
    (key: string) => {
      if (key === "Backspace") {
        setCurrentTry((v) => v.substring(0, v.length - 1));
      } else if (key === "Enter") {
        if (hasWon) {
          setShowModal(true);
        }
        const isAWord =
          currentTry.length === 5 && words.indexOf(currentTry) > -1;
        if (isAWord) {
          setTries((t: string[]) => [...t, currentTry]);
          setCurrentTry("");
        } else if (currentTry.length === 5) {
          setShowNonExistingWordWarning(true);
        }
      } else if (!hasWon) {
        setCurrentTry((value) => (value.length < 5 ? value + key : value));
      }
    },
    [currentTry]
  );

  return (
    <SafeAreaView style={styles.container}>
      <Help />
      {showNonExistingWordWarning ? <Warning /> : null}
      {showModal ? (
        <SummaryModal
          tries={tries}
          word={word}
          onClose={() => setShowModal(false)}
        />
      ) : null}
      <Title>Ordla</Title>
      <Tries word={word} tries={tries} currentTry={currentTry} />
      {(hasWon || hasLost) && modalWasShown ? (
        <ResultsLink onPress={() => setShowModal(true)} />
      ) : (
        <Keyboard word={word} tries={tries} onPress={handlePress} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  warning: {
    position: "absolute",
    top: 56,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: themeColor("bg1"),
    borderRadius: 20,
    zIndex: 100,
  },
});

function Warning() {
  return (
    <Animated.View
      style={styles.warning}
      entering={FadeInUp}
      exiting={FadeOutUp}
    >
      <Text>Ordet finns inte med i ordlistan.</Text>
    </Animated.View>
  );
}

// Pick a start date
const inception =
  new Date(1641680371437).setUTCHours(0, 0, 0, 0).valueOf() /
  (1000 * 60 * 60 * 24);

function getWordForDay(date: Date) {
  const today = date.setUTCHours(0, 0, 0, 0);
  const index = today / (1000 * 60 * 60 * 24);
  return words[(words.length / 2 + (index - inception)) % words.length];
}
type StateCallback<T> = (cb: (prevState: T) => T) => void;
