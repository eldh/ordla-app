import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Text, Title } from "./Text";
import { Help } from "./Help";
import { Keyboard } from "./Keyboard";
import { ResultsLink } from "./ResultsLink";
import { SummaryModal } from "./SummaryModal";
import { Tries } from "./Tries";
import { useTimer } from "./useTimer";
import { words } from "./words";
import Animated, {
  FadeInUp,
  FadeOut,
  FadeOutUp,
} from "react-native-reanimated";
import { themeColor } from "./Theme";
import { emitEffect, useReducerWithEffects } from "./useReducerWithEffects";
import { notReachable } from "./notReachable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function Game() {
  const [, endOfDay] = useTimer(10000);
  const word = useMemo(() => {
    return getWordForDay(endOfDay);
  }, [endOfDay]);
  const [state, setState] = useState<Record<string, any>>({});
  const triesKey = "tries5_" + word;

  // @ts-ignore
  useEffect(async () => {
    try {
      let tries = JSON.parse((await AsyncStorage.getItem(triesKey)) ?? "[]");
      let results = JSON.parse((await AsyncStorage.getItem("results")) ?? "{}");

      setState((s) => ({
        ...s,
        [triesKey]: tries,
        results,
      }));
    } catch (error) {}
  }, [word]);

  const setTries: StateCallback<string[]> = (cb) => {
    const t = cb(state[triesKey]);

    setState((s) => ({
      ...s,
      [triesKey]: t,
    }));
    AsyncStorage.setItem(triesKey, JSON.stringify(t));
  };
  const setResults: StateCallback<Record<string, number>> = (cb) => {
    const r = cb(state.results);
    setState((s) => ({
      ...s,
      ["results"]: r,
    }));
    AsyncStorage.setItem("results", JSON.stringify(r));
  };

  return word && state[triesKey] && state.results ? (
    <WordGame
      key={word ? `loaded_${word}` : "temp"}
      word={word}
      tries={state[triesKey]}
      results={state.results}
      setTries={setTries}
      setResults={setResults}
    />
  ) : (
    <LoadingBoard />
  );
}
type GameProps = {
  word: string;
  tries: string[];
  setTries: StateCallback<string[]>;
  setResults: StateCallback<Record<string, number>>;
  results: Record<string, number>;
};

type GameState = {
  currentTry: string;
  showNonExistingWordWarning: boolean;
  showModal: boolean;
  showResults: boolean;
  word: string;
  tries: string[];
  delayedTries: string[];
  results: Record<string, number>;
  nonExistingWordGuesses: number;
};

type Action =
  | { type: "setShowModal"; payload: boolean }
  | { type: "setShowResults"; payload: boolean }
  | { type: "setDelayedTries" }
  | { type: "hideNonExistingWordWarning" }
  | { type: "showNonExistingWordWarning" }
  | { type: "backspace" }
  | { type: "enter" }
  | { type: "reset"; payload: GameProps }
  | { type: "addKey"; payload: string };

function getInitialState(props: GameProps) {
  const {
    word: initialWord,
    tries: initialTries,
    results: initialResults,
  } = props;
  return {
    word: initialWord,
    tries: initialTries,
    delayedTries: initialTries,
    results: initialResults,
    currentTry: "",
    showModal: false,
    showResults:
      didWin(initialTries, initialWord) || didLose(initialTries, initialWord),
    showNonExistingWordWarning: false,
    nonExistingWordGuesses: 0,
  };
}

function WordGame(props: GameProps) {
  const { word: initialWord, setTries, setResults } = props;
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
              const t1 = setTimeout(() => {
                dispatch({ type: "setDelayedTries" });
              }, 1000);
              if (state.currentTry === word) {
                // Won
                setResults((r) => ({ ...r, [word]: state.tries.length + 1 }));
                let t2 = setTimeout(() => {
                  dispatch({ type: "setShowModal", payload: true });
                  setTimeout(() => {
                    dispatch({ type: "setShowResults", payload: true });
                  }, 500);
                }, 1000);
                return () => {
                  clearTimeout(t1);
                  clearTimeout(t2);
                };
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
            emitEffect(() => {
              const v = setTimeout(() => {
                dispatch({ type: "showNonExistingWordWarning" });
              }, 10);
              return () => clearTimeout(v);
            });
            return state;
          }
        case "backspace":
          return {
            ...state,
            currentTry: state.currentTry.substring(
              0,
              state.currentTry.length - 1
            ),
          };
        case "setDelayedTries":
          return {
            ...state,
            delayedTries: state.tries,
          };
        case "addKey":
          return state.currentTry.length >= 5
            ? state
            : { ...state, currentTry: state.currentTry + action.payload };
        case "setShowModal":
          return { ...state, showModal: action.payload };
        case "showNonExistingWordWarning":
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
        case "setShowResults":
          return { ...state, showResults: action.payload };
        case "reset":
          return getInitialState(action.payload);
        case "hideNonExistingWordWarning":
          return { ...state, showNonExistingWordWarning: false };
        default:
          throw notReachable(action);
      }
    },
    getInitialState(props)
  );
  const {
    word,
    tries,
    delayedTries,
    results,
    currentTry,
    showModal,
    showResults,
    showNonExistingWordWarning,
    nonExistingWordGuesses,
  } = s;
  const hasWon = didWin(tries, word);
  const hasLost = didLose(tries, word);

  useLayoutEffect(() => {
    if (word !== initialWord) {
      dispatch({ type: "reset", payload: props });
    }
  }, [initialWord]);

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
    <Animated.View style={{ flex: 1 }} exiting={FadeOut}>
      <SafeAreaView style={styles.container}>
        <Help />
        {showNonExistingWordWarning ? <NotAWordWarning /> : null}
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
            style={{ paddingBottom: 81, paddingTop: 10 }}
            onPress={() => dispatch({ type: "setShowModal", payload: true })}
          />
        ) : (
          <Keyboard
            word={word}
            tries={delayedTries}
            onPress={handlePress}
            key={word + nonExistingWordGuesses + "keys"}
          />
        )}
      </SafeAreaView>
    </Animated.View>
  );
}

function LoadingBoard() {
  return (
    <Animated.View style={{ flex: 1 }} exiting={FadeOut}>
      <SafeAreaView style={styles.container}>
        <Help />
        <Title>Ordla</Title>
        <Tries word="xxxxx" tries={[]} currentTry={""} key="xxxxx_tries" />
        <Keyboard word="xxxxx" tries={[]} onPress={() => {}} key="xxxxx_key" />
      </SafeAreaView>
    </Animated.View>
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
    top: 48,
  },
});

function NotAWordWarning() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={StyleSheet.compose(styles.warningWrapper, {
        top: insets.top + 6,
      } as any)}
    >
      <Animated.View
        style={styles.warning}
        entering={FadeInUp.delay(100)}
        exiting={FadeOutUp.delay(100)}
      >
        <Text>Ordet finns inte inte med i ordlistan.</Text>
      </Animated.View>
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

function didWin(tries: string[], word: string) {
  return tries[tries.length - 1] === word;
}
function didLose(tries: string[], word: string) {
  return !didWin(tries, word) && tries.length >= 6;
}
type StateCallback<T> = (cb: (prevState: T) => T) => void;
