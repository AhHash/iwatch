import { StyleSheet, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import CustomButton from "../ui/CustomButton";
import { useEffect, useState } from "react";
import { globalColors } from "../../constants/styles";

const EpisodeCounter = ({
  disabled,
  onValueChange,
  upperLimit,
  fixedValue,
  initialValue,
  style,
  onFocus,
  onEnd,
  readOnlyInput,
}) => {
  const [value, setValue] = useState(initialValue || 0);

  useEffect(() => {
    onValueChange(value);
  }, [value]);

  return (
    <View style={[styles.container, style]}>
      <CustomButton
        disabled={disabled || value <= 0}
        onPress={() => {
          setValue((previousvalue) => {
            if (previousvalue <= 0) return 0;
            return Number(previousvalue) - 1;
          });
        }}
      >
        <Ionicons name="chevron-back" size={16} />
      </CustomButton>
      <TextInput
        readOnly={readOnlyInput}
        onFocus={onFocus}
        onEndEditing={onEnd}
        style={styles.textInput}
        keyboardType="number-pad"
        value={
          typeof fixedValue == "number"
            ? fixedValue.toString()
            : value.toString()
        }
        onChangeText={(text) => {
          let newValue = 0;
          try {
            newValue = Number(text);
            if (newValue < 0 || newValue > upperLimit) {
              newValue = value;
            }
          } catch {}
          setValue(newValue);
        }}
      />
      <CustomButton
        disabled={disabled || value >= upperLimit}
        onPress={() => {
          setValue((previousvalue) => {
            if (upperLimit && previousvalue >= upperLimit) return upperLimit;
            return Number(previousvalue) + 1;
          });
        }}
      >
        <Ionicons name="chevron-forward" size={16} />
      </CustomButton>
    </View>
  );
};
export default EpisodeCounter;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    columnGap: 6,
  },
  textInput: {
    minWidth: 35,
    maxWidth: 70,
    backgroundColor: globalColors.buttonBackground,
    fontSize: 24,
    color: globalColors.textMain,
    textAlign: "center",
    paddingHorizontal: 4,
  },
});
