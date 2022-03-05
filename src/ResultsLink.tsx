import { View } from "react-native";
import { Button } from "./Button";

export function ResultsLink(props: { onPress: () => void }) {
  const { onPress } = props;
  return (
    <View>
      <Button title="Statistik" onPress={onPress} />
    </View>
  );
}
