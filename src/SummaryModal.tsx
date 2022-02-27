import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { Fade } from "./Fade";
import { H3 } from "./Text";
import { usePersistedState } from "./usePersistedState";
import { useTimer } from "./useTimer";

export function SummaryModal({
  onClose,
  tries,
  word,
}: {
  onClose(): void;
  tries: string[];
  word: string;
}) {
  const [results] = usePersistedState<Record<string, number>>("results", {});

  const guessDistribution = Object.values(results).reduce(
    (memo, v) => {
      memo[v - 1] = memo[v - 1] + 1;
      return [...memo];
    },
    [0, 0, 0, 0, 0, 0]
  );
  const maxWins = Math.max(...guessDistribution);
  return (
    <>
      <View
      // className={"modal center gap-m " + className}
      >
        <Button
          // role="button"
          // tabIndex={0}
          onPress={onClose}
          // className="close-btn"
          title="⨯"
        >
          ⨯
        </Button>
        <H3>Statistik</H3>
        <Text>
          Dagens ord:{" "}
          <Text
          // href={`https://svenska.se/tre/?sok=${word}`}
          // className="capitalize"
          // target="_new"
          // rel="noreferrer noopener"
          >
            {word}
          </Text>
        </Text>
        <View /* className="row gap-m center" */>
          <Stat number={Object.keys(results).length} label="Spelade" />
          <Stat
            number={Object.values(results).filter((v) => v > 0).length}
            label="Vinster"
          />
        </View>
        <View>
          {/* className="gap-m center grow"> */}
          <Text>Gissningar</Text>
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
        // className="row gap-l" style={{ marginTop: "36px", gap: "56px" }}
        >
          <Next />
          <Share word={word} tries={tries} />
        </View>
      </View>
      <View
      //  className={"modal-bg " + className}
      />
    </>
  );
}

function Stat(props: { number: string | number; label: string }) {
  return (
    <View>
      {/* className="center" */}
      <Text style={{ fontWeight: "900" }}>{props.number}</Text>
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
    // className="center row gap-m"
    // style={{
    //   width: "100%",
    //   flexGrow: "1",
    //   flexShrink: "0",
    // }}
    >
      <Text
      // style={{ fontWeight: "900", fontSize: "1.25rem" }}
      >
        {number}
      </Text>
      <View
      // style={{
      //   fontWeight: "900",
      //   fontSize: "0.875rem",
      //   width: "100%",
      // }}
      >
        <Text
        // style={{
        //   height: "24px",
        //   width: (wins / maxWins) * 100 + "%",
        //   alignItems: "flex-end",
        //   backgroundColor: wins > 0 ? "var(--bar-color)" : undefined,
        //   borderRadius: "4px",
        //   padding: wins > 0 ? "6px" : "6px 18px",
        // }}
        // className="center"
        >
          {wins}
        </Text>
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
    <View
    // className="center"
    >
      <Text
      // style={{ fontSize: "0.75rem" }}
      >
        Nästa ord:
      </Text>
      <Text style={{ fontWeight: "900" }}>{`${s(hours)}:${s(minutes)}:${s(
        seconds
      )}`}</Text>
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
          const isClose = !isHit;
          return isMiss || hitIsElsewhere ? "⬛" : isHit ? "🟩" : "🟨";
        })
        .join("")
    )
    .join("\n");

  const data = {
    url: window.location.href,
    text: `Ordla, ${new Date().getDate()} ${monthStr(new Date().getMonth())}:

${resultsString}
`,
    title: "Ordla",
  };

  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      const v = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(v);
    }
  }, [copied]);

  return (
    <>
      <Fade show={copied}>
        {() => (
          <View
          // style={{ top: "-20px" }}
          // className={"warning " + c}
          >
            <Text>Resultatet har kopierats</Text>
          </View>
        )}
      </Fade>
      <Button
        // className="share-btn"
        onPress={() => {
          if (navigator.share) {
            navigator.share(data);
          } else if (navigator.clipboard) {
            navigator.clipboard.writeText(data.text);
            setCopied(true);
          } else {
            alert("Kunde inte dela");
          }
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
