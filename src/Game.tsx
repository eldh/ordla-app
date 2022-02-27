import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { PlatformColor, SafeAreaView, StyleSheet, View } from "react-native";
import { Fade } from "./Fade";
import { H2, Text } from "./Text";
import { Help } from "./Help";
import { Keyboard } from "./Keyboard";
import { ResultsLink } from "./ResultsLink";
import { SummaryModal } from "./SummaryModal";
import { Tries } from "./Tries";
import { usePersistedState } from "./usePersistedState";
import { useTimer } from "./useTimer";
import { words } from "./words";

export function Game() {
  const [, endOfDay] = useTimer(10000);
  const word = useMemo(() => {
    return getWordForDay(endOfDay);
  }, [endOfDay]);
  const [tries, setTries] = usePersistedState<string[]>("tries11_" + word, []);
  const [currentTry, setCurrentTry] = useState("");
  const [warning, setWarning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const hasWon = useMemo(() => tries[tries.length - 1] === word, [tries]);
  const hasLost = useMemo(() => !hasWon && tries.length === 6, [tries, hasWon]);
  useEffect(() => {
    if (warning) {
      const v = setTimeout(() => {
        setWarning(false);
      }, 2000);
      return () => clearTimeout(v);
    }
  }, [warning]);
  useEffect(() => {
    if (hasWon || hasLost) {
      const results = JSON.parse(localStorage.getItem("results") ?? "{}");
      localStorage.setItem(
        "results",
        JSON.stringify({ ...results, [word]: hasLost ? -1 : tries.length })
      );
    }
  }, [hasWon, hasLost]);
  useLayoutEffect(() => {
    if (hasWon || hasLost) {
      setShowModal(true);
    }
  }, [hasWon, hasLost]);
  useEffect(() => {
    setShowModal(false);
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
        } else {
          setWarning(true);
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
      <Fade show={warning}>{() => <Warning />}</Fade>
      <Fade show={showModal}>
        {() => (
          <SummaryModal
            tries={tries}
            word={word}
            onClose={() => setShowModal(false)}
          />
        )}
      </Fade>
      <H2>Ordla</H2>
      <Tries word={word} tries={tries} currentTry={currentTry} />
      {hasWon || hasLost ? (
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
    // justifyContent: "center",
    justifyContent: "space-between",
  },
  text: {
    color: "#fff",
  },
});

function Warning() {
  return (
    <Text
    // className={"warning " + className}
    >
      Ordet finns inte med i ordlistan.
    </Text>
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
