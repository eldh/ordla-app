import { useState } from "react";
import {
  Button,
  Modal,
  PlatformColor,
  StyleSheet,
  View,
  Text as RNText,
} from "react-native";
import { B, H3, Text } from "./Text";
import { Square } from "./Square";
import { themeColor } from "./Theme";

export function Help({}: {}) {
  const [help, setHelp] = useState(false);
  return (
    <>
      <View style={styles.button}>
        <Button title="?" onPress={() => setHelp(true)} />
      </View>
      <Modal
        animationType="slide"
        presentationStyle="pageSheet"
        visible={help}
        onRequestClose={() => setHelp(false)}
      >
        <View style={styles.content}>
          <View style={styles.closeButton}>
            <Button title="Stäng" onPress={() => setHelp(false)} />
          </View>
          <H3>Hur spelar man?</H3>
          <Spacer />
          <Text>
            Du har 6 försök på dig att gissa ordet. Brickorna visar vilka
            bokstäver i dina gissningar som är rätt.
          </Text>
          <Spacer />
          <Example word="sneda" guess="sjung" />
          <Spacer />
          <RNText>
            <Text>I examplet ovan är</Text>
            <B> S</B>
            <Text> på rätt plats i ordet och </Text>
            <B>N </B>
            <Text>
              finns i ordet men är på fel plats. På tangentbordet syns vilka
              bokstäver som är med i ordet och vilka som inte är med.
            </Text>
          </RNText>
          <Spacer />
          <Text>Varje dag kommer ett nytt ord.</Text>
        </View>
      </Modal>
    </>
  );
}
function Example({ word, guess }: { word: string; guess: string }) {
  return (
    <View
      style={styles.example}
      //className="row gap-s"
    >
      {guess.split("").map((l, i) => (
        <Square word={word} letter={l} key={l} index={i} isCurrentTry={false} />
      ))}
    </View>
  );
}

function Spacer() {
  return <View style={styles.spacer} />;
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 24,
    marginTop: 30,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },
  spacer: {
    height: 18,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 62,
    backgroundColor: themeColor("bg"),
  },
  example: {
    flexDirection: "row",
  },
});
