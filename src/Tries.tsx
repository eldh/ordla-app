import { Platform, PlatformColor, StyleSheet, View } from "react-native";
import { EmptySquare, Square } from "./Square";

export function Tries(props: {
  currentTry: string;
  word: string;
  tries: string[];
}) {
  const { tries, currentTry, word } = props;

  return (
    <View
      // className="gap-s center"
      // style={{ margin: "auto", padding: "6px", maxWidth: "calc(100vw - 12px)" }}
      style={styles.container}
    >
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <View
          // className="row center gap-s"
          key={"row" + i}
          style={styles.row}
        >
          {[0, 1, 2, 3, 4].map((j) => {
            const letter: string | undefined = [...tries, currentTry][i]?.[j];
            return letter ? (
              <Square
                index={j}
                guess={[...tries, currentTry][i]}
                isCurrentTry={i >= tries.length}
                word={word}
                letter={letter}
                key={"" + i + j}
              />
            ) : (
              <EmptySquare key={"" + i + j} />
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
    // width: 208,
  },
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
  },
});
