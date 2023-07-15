import { useLayoutEffect, useMemo } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import EpisodeCounter from "../components/commitments/EpisodeCounter";
import CustomButton from "../components/ui/CustomButton";
import {
  deleteCommitment,
  updateCommitment,
} from "../features/commitments/commitmentsThunk";
import Commitment from "../models/Commitment";
import { Item } from "react-navigation-header-buttons";
import { setIsEditing } from "../features/commitments/commitmentsSlice";
import CommitmentButtons from "../components/commitments/CommitmentButtons";
import CommitmentDeleteButton from "../components/commitments/CommitmentDeleteButton";
import { limitString } from "../util/format";
import { useIsFocused } from "@react-navigation/native";
import { globalColors } from "../constants/styles";

const CommitmentsScreen = ({
  route: {
    params: { id },
  },
  navigation: { setOptions, navigate },
}) => {
  const isFocused = useIsFocused();
  const commitments = useSelector((store) => store.commitments.commitments);
  const categories = useSelector((store) => store.categories.categories);
  const dispatch = useDispatch();

  const selectedCommitment = useMemo(() => {
    return commitments.find((commitment) => commitment.id == id);
  }, [id, isFocused]);
  const currentCategory = useMemo(() => {
    return categories.find(
      (category) => category.id == selectedCommitment.category
    );
  }, [selectedCommitment]);

  useLayoutEffect(() => {
    setOptions({
      title: selectedCommitment.name,
      headerRight: () => {
        return (
          <Item
            title="Edit"
            onPress={() => {
              dispatch(setIsEditing(true));
              navigate("Manage", {
                mode: "edit",
                type: "commitment",
                id: selectedCommitment.id,
              });
            }}
          />
        );
      },
    });
  }, [selectedCommitment]);

  return (
    <View style={styles.container}>
      <View style={styles.upperContainer}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={
              typeof selectedCommitment.imgUri == "number"
                ? selectedCommitment.imgUri
                : { uri: selectedCommitment.imgUri }
            }
          />
        </View>
        <View style={styles.upperContainerTextContainerContainer}>
          <View style={styles.upperContainerTextContainer}>
            <Text
              style={[
                styles.nameText,
                selectedCommitment.name.length > 8 && { fontSize: 26 },
              ]}
            >
              {selectedCommitment.name}
            </Text>
            <View style={styles.upperContainerDataContainer}>
              <Text
                style={[
                  styles.categoryText,
                  { color: currentCategory.colorCode },
                ]}
              >
                {currentCategory.name}
              </Text>
              <Text style={styles.plainText}>
                {selectedCommitment.type}
                {selectedCommitment.type == "multi-episode" &&
                  `\n${selectedCommitment.totalEpisodes} Episode${
                    selectedCommitment.totalEpisodes > 1 ? "s" : ""
                  }`}
              </Text>
              <Text
                style={[styles.plainText, styles[selectedCommitment.status]]}
              >
                {selectedCommitment.status}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.middleContainer}>
        <View style={styles.descriptionTextContainer}>
          <Text style={styles.fieldTitle}>Description</Text>
          <Text
            style={[
              styles.descriptionText,
              !selectedCommitment.description && styles.dimmedText,
            ]}
          >
            {selectedCommitment.description
              ? limitString(selectedCommitment.description, 600)
              : "No description exists for here this commitment. Maybe edit it to add one..."}
          </Text>
        </View>
      </View>

      <View style={styles.lowerContainer}>
        <View style={styles.commitmentButtonsContainer}>
          <View>
            <CommitmentButtons commitment={selectedCommitment} />
          </View>
          <CommitmentDeleteButton commitment={selectedCommitment} />
        </View>
      </View>
    </View>
  );
};

export default CommitmentsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  upperContainer: {
    flex: 6,
    flexDirection: "row",
  },
  imageContainer: {
    flex: 1,
    backgroundColor: globalColors.inputBackground,
    padding: 6,
    borderRadius: 5,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  upperContainerTextContainerContainer: {
    flex: 1,
  },
  upperContainerTextContainer: {
    flex: 1,
    padding: 10,
  },
  nameText: {
    fontSize: 30,
    textTransform: "capitalize",
    fontWeight: "bold",
    color: globalColors.textMain,
    marginBottom: 5,
  },
  upperContainerDataContainer: { flex: 1, rowGap: 8, marginLeft: 5 },
  categoryText: {
    color: globalColors.textMain,
    fontSize: 26,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  plainText: {
    color: globalColors.textAccent,
    textTransform: "uppercase",
    fontSize: 16,
  },
  ["yet to watch"]: { color: globalColors.yetToWatch },
  ["watching"]: { color: globalColors.watching },
  ["finished"]: { color: globalColors.finished },
  fieldTitle: {
    color: globalColors.textAccent,
    fontWeight: "bold",
    fontSize: 16,
  },
  middleContainer: { flex: 8 },
  descriptionTextContainer: { flex: 1, padding: 10, rowGap: 5, marginTop: 5 },
  descriptionText: {
    color: globalColors.textMain,
    textAlign: "justify",
    fontSize: 16,
  },
  lowerContainer: { flex: 5 },
  commitmentButtonsContainer: {
    flex: 1,
    justifyContent: "center",
    rowGap: "10%",
    borderTopColor: globalColors.borderColor,
    borderTopWidth: 5,
    marginBottom: 10,
  },
  dimmedText: {
    color: globalColors.textAccent,
    textAlign: "left",
    fontSize: 14,
  },
});
