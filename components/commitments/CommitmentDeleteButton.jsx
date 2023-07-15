import { Alert, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

import CustomButton from "../ui/CustomButton";
import { title } from "../../util/format";
import { deleteCommitment } from "../../features/commitments/commitmentsThunk";

const CommitmentDeleteButton = ({ commitment, icon, limited, noBack }) => {
  const dispatch = useDispatch();
  const { goBack } = useNavigation();

  return (
    <View style={styles.deleteButtonContainer}>
      <CustomButton
        style={[styles.button, limited && styles.limitedButton]}
        textStyle={styles.buttonText}
        warning
        onPress={() => {
          Alert.alert(
            "Confirm Deletion",
            `Are you sure you want to delete the commitment: ${title(
              commitment.name
            )}?`,
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                  dispatch(deleteCommitment(commitment.id));
                  if (!noBack) {
                    goBack();
                  }
                },
              },
            ],
            { userInterfaceStyle: "dark" }
          );
        }}
      >
        {icon ? <Ionicons name="trash" size={24} /> : "Delete Commitment"}
      </CustomButton>
    </View>
  );
};

export default CommitmentDeleteButton;

const styles = StyleSheet.create({
  deleteButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 8,
    minWidth: "60%",
  },
  limitedButton: {
    minWidth: 0,
    marginRight: 5,
  },
  buttonText: {
    textAlign: "center",
  },
});
