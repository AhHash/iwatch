import {
  Pressable,
  Text,
  PlatformColor,
  Platform,
  StyleSheet,
} from "react-native";
import { globalColors } from "../../constants/styles";

const CustomButton = ({
  onPress,
  children,
  style,
  textStyle,
  warning,
  disabled,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => {
        return [styles.container, pressed && styles.pressed, style];
      }}
    >
      <Text
        style={[
          styles.text,
          (warning || disabled) && styles.warningText,
          textStyle,
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: globalColors.buttonBackground,
    borderRadius: 4,
  },
  text: {
    fontSize: 18,
    color:
      Platform.OS == "ios"
        ? PlatformColor("systemBlue")
        : PlatformColor("@android:color/holo_blue_dark"),
  },
  warningText: {
    color:
      Platform.OS == "ios"
        ? PlatformColor("systemRed")
        : PlatformColor("@android:color/holo_red_dark"),
  },
  pressed: {
    opacity: 0.9,
  },
});
