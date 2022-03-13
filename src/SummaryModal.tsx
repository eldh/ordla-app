import {
  Modal,
  PlatformColor,
  StyleSheet,
  Share as RNShare,
  Button as RNButton,
  View,
  Text as RNText,
} from "react-native";
import { Button } from "./Button";
import { H3, Text, B, H1 } from "./Text";
import { useTimer } from "./useTimer";

export function SummaryModal({
  onClose,
  tries,
  results,
  word,
}: {
  onClose(): void;
  tries: string[];
  word: string;
  results: Record<string, number>;
}) {
  const guessDistribution = Object.values(results).reduce(
    (memo, v) => {
      memo[v - 1] = memo[v - 1] + 1;
      return [...memo];
    },
    [0, 0, 0, 0, 0, 0]
  );
  const maxWins = Math.max(...guessDistribution);
  const winCount = Object.values(results).filter((v) => v > 0).length;
  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet">
      <View style={styles.content}>
        <View style={styles.closeButton}>
          <RNButton onPress={onClose} title="Stäng" />
        </View>
        <H1>Statistik</H1>
        <Spacer />
        <Spacer />
        <Spacer />

        <View
          style={{
            alignItems: "center",
          }}
        >
          <RNText>
            <Text>Dagens ord: </Text>
            <Text
              style={{ textTransform: "capitalize" }}
              // href={`https://svenska.se/tre/?sok=${word}`}
              // className="capitalize"
              // target="_new"
              // rel="noreferrer noopener"
            >
              {word}
            </Text>
          </RNText>
        </View>
        <Spacer />
        <View
          style={{
            ...styles.row,
            width: "100%",
            justifyContent: "center",
          }}
        >
          <Stat number={Object.keys(results).length} label={"Spelade"} />
          <Spacer />
          <Stat number={winCount} label={"Vinster"} />
        </View>
        <Spacer />
        <View
          style={{
            width: "100%",
            justifyContent: "center",
          }}
        >
          <H3>Gissningar</H3>
          {/* style={{ fontSize: "16", fontWeight: "600" }} */}
          <View>
            {/*  className="gap-s grow" */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Bar
                number={i}
                maxWins={maxWins}
                wins={guessDistribution[i - 1]}
                key={i}
              />
            ))}
          </View>
        </View>
        <View
          style={[styles.row, { justifyContent: "space-around" }]}
          // className="row gap-l" style={{ marginTop: "36px", gap: "56px" }}
        >
          <Next />
          <Share word={word} tries={tries} />
        </View>
      </View>
    </Modal>
  );
}

function Stat(props: { number: string | number; label: string }) {
  return (
    <View style={{ alignItems: "center" }}>
      {/* className="center" */}
      <B style={{ fontSize: 24 }}>{`${props.number} `}</B>
      <Text
      // style={{ fontSize: "0.75rem" }}
      >
        {props.label}
      </Text>
    </View>
  );
}

function Bar(props: { number: number; wins: number; maxWins: number }) {
  const { wins, maxWins, number } = props;

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 12,
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <B>{`${number}`}</B>
      <View
        style={{
          flex: 1,
          marginLeft: 6,
        }}
      >
        <View
          style={{
            maxWidth: (wins / maxWins) * 100 + "%",
            borderRadius: 4,
            padding: 4,
            justifyContent: "flex-end",
            alignItems: "flex-end",
            backgroundColor:
              wins > 0 ? PlatformColor("systemGreen") : undefined,
          }}
        >
          <B shadow>{`${wins}`}</B>
        </View>
      </View>
    </View>
  );
}

function Next() {
  const [now, endOfDay] = useTimer();

  const hours = endOfDay.getUTCHours() - now.getUTCHours();
  const minutes = endOfDay.getUTCMinutes() - now.getUTCMinutes();
  const seconds = endOfDay.getUTCSeconds() - now.getUTCSeconds();
  let s = (n: number) => (n < 10 ? `0${n}` : n);

  return (
    <View style={{ alignItems: "center" }}>
      <Text>Nästa ord:</Text>
      <B style={{ fontSize: 24, fontVariant: ["tabular-nums"] }}>{`${s(
        hours
      )}:${s(minutes)}:${s(seconds)}`}</B>
    </View>
  );
}

function Share({ tries, word }: { word: string; tries: string[] }) {
  let resultsString = tries
    .map((t) =>
      t
        .split("")
        .map((l, i) => {
          const isMiss = word.indexOf(l) === -1;
          const isHit = word[i] === l;
          const hitIsElsewhere =
            !isHit &&
            t
              ?.split("")
              .filter((l2, i) => word[i] === l2)
              .includes(l);
          return isMiss || hitIsElsewhere ? "⬛" : isHit ? "🟩" : "🟨";
        })
        .join("")
    )
    .join("\n");

  const data = {
    url: "",
    text: `Ordla, ${new Date().getDate()} ${monthStr(new Date().getMonth())}:

${resultsString}
`,
    title: "Ordla",
  };

  return (
    <>
      {/* <Fade show={copied}>
        {() => (
          <View
          // style={{ top: "-20px" }}
          // className={"warning " + c}
          >
            <Text>Resultatet har kopierats</Text>
          </View>
        )}
      </Fade> */}
      <Button
        // className="share-btn"
        onPress={() => {
          RNShare.share({
            title: "Ordla",
            message: `Ordla, ${new Date().getDate()} ${monthStr(
              new Date().getMonth()
            )}:

${resultsString}
`,
          });
        }}
        title="Dela"
      />
    </>
  );
}

function monthStr(m: number) {
  return [
    "januari",
    "februari",
    "mars",
    "april",
    "maj",
    "juni",
    "juli",
    "augusti",
    "september",
    "oktober",
    "november",
    "december",
  ][m];
}

function Spacer() {
  return <View style={styles.spacer} />;
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 24,
    right: 24,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 12,
    zIndex: 10,
  },
  spacer: {
    height: 18,
    width: 18,
  },
  row: { flexDirection: "row" },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 24,
    backgroundColor: PlatformColor("secondarySystemBackground"),
  },
  example: {
    flexDirection: "row",
  },
});
