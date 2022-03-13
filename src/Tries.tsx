import * as React from "react";
import { StyleSheet, View } from "react-native";
import { EmptySquare, Square } from "./Square";

export function Tries(props: {
  currentTry: string;
  word: string;
  tries: string[];
}) {
  const { tries, currentTry, word } = props;

  return (
    <View style={styles.container}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <View key={`${i}_row`} style={styles.row}>
          {[0, 1, 2, 3, 4].map((j) => {
            const letter: string | undefined = [...tries, currentTry][i]?.[j];
            return letter ? (
              <Square
                index={j}
                guess={[...tries, currentTry][i]}
                isCurrentTry={i >= tries.length}
                word={word}
                letter={letter}
                key={`${i}_${j}`}
              />
            ) : (
              <EmptySquare key={`${i}_${j}_empty`} />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
  },
});
