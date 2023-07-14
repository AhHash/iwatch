import { Text, StyleSheet } from "react-native";

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
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  warningText: {
    color: "rgb(231, 105, 105)",
  },
});
