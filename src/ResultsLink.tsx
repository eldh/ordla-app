import { StyleProp, View } from "react-native";
import { Button } from "./Button";

export function ResultsLink(props: {
  onPress: () => void;
  style?: StyleProp<object>;
}) {
  const { onPress, ...etc } = props;
  return (
    <View {...etc}>
      <Button title="Statistik" onPress={onPress} />
    </View>
  );
}
