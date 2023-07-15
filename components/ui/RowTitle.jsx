import { Text, StyleSheet } from "react-native";
import { globalColors } from "../../constants/styles";

const RowTitle = ({ errors, error, title, inline }) => {
  return (
    <Text
      style={[
        styles.rowTitle,
        { marginBottom: inline ? 0 : 10 },
        errors?.includes(error) && styles.warningText,
      ]}
    >
      {title}
    </Text>
  );
};

export default RowTitle;

const styles = StyleSheet.create({
  rowTitle: {
    color: globalColors.textMain,
    fontSize: 16,
    fontWeight: "bold",
  },
  warningText: {
    color: globalColors.textWarning,
  },
});
