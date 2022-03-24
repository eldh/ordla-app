import { useCallback, useMemo } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Text, Title } from "./Text";
import { Help } from "./Help";
import { Keyboard } from "./Keyboard";
import { ResultsLink } from "./ResultsLink";
import { SummaryModal } from "./SummaryModal";
import { Tries } from "./Tries";
import { usePersistedState } from "./usePersistedState";
import { useTimer } from "./useTimer";
import { words } from "./words";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { themeColor } from "./Theme";
import { emitEffect, useReducerWithEffects } from "./useReducerWithEffects";
import { notReachable } from "./notReachable";

export function Game() {
  const [, endOfDay] = useTimer(10000);
  const word = useMemo(() => {
    return getWordForDay(endOfDay);
  }, [endOfDay]);
  const [tries, setTries, triesLoaded] = usePersistedState<string[]>(
    "tries3_" + word,
    []
  );
  const [results, setResults, resultsLoaded] = usePersistedState<
    Record<string, number>
  >("results", {});

  return (
    <WordGame
      key={word && triesLoaded && resultsLoaded ? `loaded_${word}` : "temp"}
      word={word}
      tries={tries}
      results={results}
      setTries={setTries}
      setResults={setResults}
    />
  );
}

type GameState = {
  currentTry: string;
  showNonExistingWordWarning: boolean;
  showModal: boolean;
  showResults: boolean;
  tries: string[];
  results: Record<string, number>;
  nonExistingWordGuesses: number;
};

type Action =
  | { type: "setShowModal"; payload: boolean }
  | { type: "setShowResults"; payload: boolean }
  | { type: "hideNonExistingWordWarning" }
  | { type: "backspace" }
  | { type: "enter" }
  | { type: "addKey"; payload: string };

function WordGame({
  word,
  tries: initialTries,
  results: initialResults,
  setTries,
  setResults,
}: {
  word: string;
  tries: string[];
  setTries: StateCallback<string[]>;
  setResults: StateCallback<Record<string, number>>;
  results: Record<string, number>;
}) {
  const [s, dispatch] = useReducerWithEffects<GameState, Action>(
    (state: GameState, action: Action) => {
      switch (action.type) {
        case "enter":
          const isAWord =
            state.currentTry.length === 5 &&
            words.indexOf(state.currentTry) > -1;
          if (isAWord) {
            emitEffect(() => {
              setTries((t) => [...t, state.currentTry]);
              if (state.currentTry === word) {
                // Won
                setResults((r) => ({ ...r, [word]: state.tries.length + 1 }));
                let t = setTimeout(() => {
                  dispatch({ type: "setShowModal", payload: true });
                  setTimeout(() => {
                    dispatch({ type: "setShowResults", payload: true });
                  }, 500);
                }, 1000);
                return () => clearTimeout(t);
              } else if (state.tries.length === 5) {
                // Lost
                setResults((r) => ({ ...r, [word]: 0 }));
                let t = setTimeout(() => {
                  dispatch({ type: "setShowModal", payload: true });
                  setTimeout(() => {
                    dispatch({ type: "setShowResults", payload: true });
                  }, 500);
                }, 1000);
                return () => clearTimeout(t);
              }
            });
            return {
              ...state,
              currentTry: "",
              tries: [...state.tries, state.currentTry],
              results: { ...state.results, [word]: state.tries.length + 1 },
            };
          } else if (state.currentTry.length === 5) {
            setTimeout;
            emitEffect(() => {
              const v = setTimeout(() => {
                dispatch({ type: "hideNonExistingWordWarning" });
              }, 2000);
              return () => clearTimeout(v);
            });
            return {
              ...state,
              showNonExistingWordWarning: true,
              nonExistingWordGuesses: state.nonExistingWordGuesses + 1,
            };
          }
        case "backspace":
          return {
            ...state,
            currentTry: state.currentTry.substring(
              0,
              state.currentTry.length - 1
            ),
          };
        case "addKey":
          return state.currentTry.length >= 5
            ? state
            : { ...state, currentTry: state.currentTry + action.payload };
        case "setShowModal":
          return { ...state, showModal: action.payload };
        case "setShowResults":
          return { ...state, showResults: action.payload };
        case "hideNonExistingWordWarning":
          return { ...state, showNonExistingWordWarning: false };
        default:
          throw notReachable(action);
      }
    },
    {
      tries: initialTries,
      results: initialResults,
      currentTry: "",
      showModal: false,
      showResults: didWin(initialTries, word) || didLose(initialTries, word),
      showNonExistingWordWarning: false,
      nonExistingWordGuesses: 0,
    }
  );
  const {
    tries,
    results,
    currentTry,
    showModal,
    showResults,
    showNonExistingWordWarning,
    nonExistingWordGuesses,
  } = s;
  const hasWon = didWin(tries, word);
  const hasLost = didLose(tries, word);

  const handlePress = useCallback(
    (key: string) => {
      if (key === "Backspace") {
        dispatch({ type: "backspace" });
      } else if (key === "Enter") {
        dispatch({ type: "enter" });
      } else if (!hasWon) {
        dispatch({ type: "addKey", payload: key });
      }
    },
    [currentTry]
  );

  return (
    <>
      {/* {showNonExistingWordWarning ? (
        <Warning key={`${showNonExistingWordWarning}warn`} />
      ) : null} */}
      <SafeAreaView style={styles.container}>
        <Help />
        {showModal ? (
          <SummaryModal
            tries={tries}
            results={results}
            word={word}
            onClose={() => dispatch({ type: "setShowModal", payload: false })}
          />
        ) : null}
        <Title>Ordla</Title>
        <Tries
          word={word}
          tries={tries}
          currentTry={currentTry}
          key={word + nonExistingWordGuesses + "tries"}
        />
        {(hasWon || hasLost) && showResults ? (
          <ResultsLink
            onPress={() => dispatch({ type: "setShowModal", payload: true })}
          />
        ) : (
          <Keyboard
            word={word}
            tries={tries}
            onPress={handlePress}
            key={word + nonExistingWordGuesses + "keys"}
          />
        )}
      </SafeAreaView>
    </>
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
    top: 0,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: themeColor("bg1"),
    borderRadius: 20,
  },
  warningWrapper: {
    position: "absolute",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    top: 28,
  },
});

function Warning() {
  return (
    <View style={styles.warningWrapper}>
      <View style={styles.warning}>
        <Text>Ordet finns inte inte med i ordlistan.</Text>
      </View>
    </View>
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

function didWin(tries: string[], word: string) {
  return tries[tries.length - 1] === word;
}
function didLose(tries: string[], word: string) {
  return !didWin(tries, word) && tries.length >= 6;
}
