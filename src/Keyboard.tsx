import * as React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableNativeFeedback,
  View,
} from "react-native";
import { Text } from "./Text";
import { darkTheme, themeColor, useShadowStyle, useTheme } from "./Theme";

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
  const [pressed, setPressed] = React.useState(false);

  const hit = tries.some((try_) =>
    try_.split("").some((letter, i) => letter === key_ && letter === word[i])
  );

  const almost =
    !hit && word.indexOf(key_) > -1 && tries.some((t) => t.indexOf(key_) > -1);
  const miss =
    word.indexOf(key_) === -1 && tries.some((t) => t.indexOf(key_) > -1);
  const doubleSize = ["Backspace", "Enter"].includes(key_);
  const key = (moreStyles?: StyleProp<object>) => (
    <Text
      shadow={theme === darkTheme}
      style={StyleSheet.compose(keyStyles.text, moreStyles)}
    >
      {key_ === "Backspace" ? "←" : key_}
    </Text>
  );

  const theme = useTheme();
  const shadowStyle = useShadowStyle("shadow1");

  const colorStyle = React.useMemo(() => {
    return {
      backgroundColor: hit
        ? theme.green
        : almost
        ? theme.orange
        : miss
        ? theme.bg1
        : theme.bg2,
    };
  }, [hit, almost, miss, theme]);

  return (
    <View
      style={StyleSheet.compose(keyStyles.key, [
        doubleSize ? [keyStyles.double, colorStyle] : colorStyle,
        shadowStyle,
      ])}
    >
      <TouchableNativeFeedback
        onPressIn={() => {
          setPressed(true);
        }}
        onPressOut={() => {
          setPressed(false);
        }}
        onPress={(_e) => {
          onPress(key_);
        }}
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
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
    borderRadius: 6,
    flex: 1,
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
    color: themeColor("text1"),
  },
  textCallout: {
    fontSize: 20,
  },
  extra: {
    width: "120%",
    backgroundColor: themeColor("bg2"),
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderRadius: 8,
    borderTopRightRadius: 8,
    top: -62,
  },
  double: {
    flex: 2,
  },
});

const keys = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "å"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ö", "ä"],
  ["Enter", "z", "x", "c", "v", "b", "n", "m", "Backspace"],
];
