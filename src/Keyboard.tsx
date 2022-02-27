import { useState } from "react";
import {
  PlatformColor,
  StyleProp,
  StyleSheet,
  TouchableNativeFeedback,
  View,
} from "react-native";
import { Text } from "./Text";

export function Keyboard(props: {
  onPress: (key: string) => void;
  word: string;
  tries: string[];
}) {
  const { word, tries, onPress } = props;

  return (
    <View style={keyboardStyles.container}>
      {keys.map((keyRow) => (
        <View key={keyRow.join("")} style={keyboardStyles.row}>
          {keyRow.map((k) => (
            <Key key={k} word={word} tries={tries} key_={k} onPress={onPress} />
          ))}
        </View>
      ))}
    </View>
  );
}

const keyboardStyles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: "100%",
    paddingLeft: 4,
    paddingRight: 4,
  },
  row: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
  },
});

export function Key(props: {
  key_: string;
  onPress: (key: string) => void;
  tries: string[];
  word: string;
}) {
  const { key_, onPress, tries, word } = props;
  const [pressed, setPressed] = useState(false);

  const hit = tries.some((try_) =>
    try_.split("").some((letter, i) => letter === key_ && letter === word[i])
  );

  const almost =
    !hit && word.indexOf(key_) > -1 && tries.some((t) => t.indexOf(key_) > -1);
  const miss =
    word.indexOf(key_) === -1 && tries.some((t) => t.indexOf(key_) > -1);
  const doubleSize = ["Backspace", "Enter"].includes(key_);
  const key = (moreStyles?: StyleProp<object>) => (
    <Text shadow style={StyleSheet.compose(keyStyles.text, moreStyles)}>
      {key_ === "Backspace" ? "←" : key_}
    </Text>
  );

  return (
    <View
      style={StyleSheet.compose(
        keyStyles.key,
        doubleSize
          ? keyStyles.double
          : hit
          ? keyStyles.hit
          : almost
          ? keyStyles.almost
          : miss
          ? keyStyles.miss
          : undefined
      )}
    >
      <TouchableNativeFeedback
        onPressIn={() => {
          setPressed(true);
        }}
        onPressOut={() => {
          setPressed(false);
        }}
        // className={
        //   "keyboard__key center" + (pressed ? " keyboard__key--pressed" : "")
        // }
        // onPointerDown={(e) => {
        //   onPress(key_);
        //   prevent(e);
        //   setPressed(true);
        // }}
        onPress={(_e) => {
          onPress(key_);
          // prevent(e);
        }}
        // onPointerUp={(e) => {
        //   prevent(e);
        //   setPressed(false);
        // }}
        // onPointerLeave={(e) => {
        //   setPressed(false);
        // }}
        // onPointerMove={(e) => {
        //   setPressed(false);
        // }}
        // style={{
        //   width: ["Enter", "Backspace"].includes(key_) ? "82px" : "38px",
        //   height: "38px",
        //   textTransform: "uppercase",
        //   flexShrink: 1,
        //   background: hit
        //     ? "var(--btn-bg--hit)"
        //     : almost
        //     ? "var(--btn-bg--almost)"
        //     : miss
        //     ? "var(--btn-bg--miss)"
        //     : "var(--btn-bg)",
        // }}
        // title={key}
      >
        <View style={keyStyles.touchable}>{key()}</View>
      </TouchableNativeFeedback>
      {pressed ? (
        <View style={keyStyles.extra}>{key(keyStyles.textCallout)}</View>
      ) : null}
    </View>
  );
}

const keyStyles = StyleSheet.create({
  key: {
    backgroundColor: PlatformColor("tertiarySystemBackground"),
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
    borderRadius: 6,
    flex: 1,
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
  },
  touchable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  text: {
    fontWeight: "600",
    textTransform: "capitalize",
    fontSize: 17,
  },
  textCallout: {
    fontSize: 20,
  },
  extra: {
    width: "120%",
    backgroundColor: PlatformColor("tertiarySystemBackground"),
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderRadius: 8,
    borderTopRightRadius: 8,
    top: -62,
    shadowColor: "#000000",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  double: {
    flex: 2,
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

const keys = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "å"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ö", "ä"],
  ["Enter", "z", "x", "c", "v", "b", "n", "m", "Backspace"],
];
