import { useLayoutEffect } from "react";
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

const CommitmentsScreen = ({
  route: {
    params: { id },
  },
  navigation: { setOptions, navigate },
}) => {
  const currentCommitment = useSelector(
    (store) => store.commitments.commitments
  ).find((commitment) => commitment.id == id);
  const currentCategory = useSelector(
    (store) => store.categories.categories
  ).find((category) => category.id == currentCommitment.category);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    setOptions({
      title: currentCommitment.name,
      headerRight: () => {
        return (
          <Item
            title="Edit"
            onPress={() => {
              dispatch(setIsEditing(true));
              navigate("Manage", {
                mode: "edit",
                type: "commitment",
                id: currentCommitment.id,
              });
            }}
          />
        );
      },
    });
  }, []);

  const showEpisodesButtons =
    currentCommitment.type != "movie" && currentCommitment.status == "watching";
  const showWatchButtons =
    currentCommitment.type != "movie" &&
    currentCommitment.status == "yet to watch";
  const showRewatchButton =
    currentCommitment.type != "movie" && currentCommitment.status == "finished";
  const showMarkAsUndoneButton =
    currentCommitment.type == "movie" && currentCommitment.status == "finished";
  const showMarkAsDoneButton =
    currentCommitment.type == "movie" &&
    (currentCommitment.status == "watching" ||
      currentCommitment.status == "yet to watch");

  return (
    <View style={styles.container}>
      <View style={styles.upperContainer}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={
              typeof currentCommitment.imgUri == "number"
                ? currentCommitment.imgUri
                : { uri: currentCommitment.imgUri }
            }
          />
        </View>
        <View style={styles.upperContainerTextContainerContainer}>
          <View style={styles.upperContainerTextContainer}>
            <Text
              style={[
                styles.nameText,
                currentCommitment.name.length > 8 && { fontSize: 26 },
              ]}
            >
              {currentCommitment.name}
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
                {currentCommitment.type}
                {currentCommitment.type == "multi-episode" &&
                  `\n${currentCommitment.totalEpisodes} Episode${
                    currentCommitment.totalEpisodes > 1 && "s"
                  }`}
              </Text>
              <Text
                style={[styles.plainText, styles[currentCommitment.status]]}
              >
                {currentCommitment.status}
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
              !currentCommitment.description && styles.dimmedText,
            ]}
          >
            {currentCommitment.description
              ? currentCommitment.description.length >= 750
                ? currentCommitment.description.slice(0, 750) + "..."
                : currentCommitment.description
              : "No description exists for here this commitment. Maybe edit it to add one..."}
          </Text>
        </View>
      </View>

      <View style={styles.lowerContainer}>
        <View style={styles.commitmentButtonsContainer}>
          <View style={styles.buttonsUpperContainer}>
            {showEpisodesButtons && (
              <View style={styles.commitmentEpisodeButtonsContainer}>
                <Text style={styles.episodeText}>Current Episode</Text>
                <View style={styles.episodeCounter}>
                  <EpisodeCounter
                    readOnlyInput
                    initialValue={currentCommitment.currentEpisode}
                    onValueChange={(value) => {
                      if (value >= currentCommitment.totalEpisodes) {
                        currentCommitment.status = "finished";
                      }
                      dispatch(
                        updateCommitment(
                          new Commitment(
                            currentCommitment.name,
                            currentCommitment.imgUri,
                            currentCommitment.imgLocal,
                            currentCommitment.totalEpisodes,
                            currentCommitment.currentEpisode,
                            currentCommitment.category,
                            currentCommitment.description,
                            currentCommitment.status,
                            currentCommitment.type,
                            currentCommitment.id
                          )
                        )
                      );
                    }}
                    upperLimit={currentCommitment.totalEpisodes}
                  />
                  <Text
                    style={styles.totalEpisodesCount}
                  >{`/ ${currentCommitment.totalEpisodes}`}</Text>
                </View>
              </View>
            )}

            {showRewatchButton && (
              <View style={styles.buttonContainer}>
                <CustomButton
                  style={styles.button}
                  textStyle={styles.buttonText}
                  onPress={() => {
                    currentCommitment.currentEpisode = 0;
                    currentCommitment.status = "watching";
                    dispatch(
                      updateCommitment(
                        new Commitment(
                          currentCommitment.name,
                          currentCommitment.imgUri,
                          currentCommitment.imgLocal,
                          currentCommitment.totalEpisodes,
                          currentCommitment.currentEpisode,
                          currentCommitment.category,
                          currentCommitment.description,
                          currentCommitment.status,
                          currentCommitment.type,
                          currentCommitment.id
                        )
                      )
                    );
                  }}
                >
                  <Text>Rewatch</Text>
                </CustomButton>
              </View>
            )}

            {showWatchButtons && (
              <View style={styles.buttonContainer}>
                <CustomButton
                  style={styles.button}
                  textStyle={styles.buttonText}
                  onPress={() => {
                    currentCommitment.currentEpisode = 0;
                    currentCommitment.status = "watching";
                    dispatch(
                      updateCommitment(
                        new Commitment(
                          currentCommitment.name,
                          currentCommitment.imgUri,
                          currentCommitment.imgLocal,
                          currentCommitment.totalEpisodes,
                          currentCommitment.currentEpisode,
                          currentCommitment.category,
                          currentCommitment.description,
                          currentCommitment.status,
                          currentCommitment.type,
                          currentCommitment.id
                        )
                      )
                    );
                  }}
                >
                  <Text>Watch</Text>
                </CustomButton>
              </View>
            )}

            {showMarkAsDoneButton && (
              <View style={styles.buttonContainer}>
                <CustomButton
                  style={styles.button}
                  textStyle={styles.buttonText}
                  onPress={() => {
                    currentCommitment.currentEpisode =
                      currentCommitment.totalEpisodes;
                    currentCommitment.status = "finished";
                    dispatch(
                      updateCommitment(
                        new Commitment(
                          currentCommitment.name,
                          currentCommitment.imgUri,
                          currentCommitment.imgLocal,
                          currentCommitment.totalEpisodes,
                          currentCommitment.currentEpisode,
                          currentCommitment.category,
                          currentCommitment.description,
                          currentCommitment.status,
                          currentCommitment.type,
                          currentCommitment.id
                        )
                      )
                    );
                  }}
                >
                  <Text>Mark as Done</Text>
                </CustomButton>
              </View>
            )}

            {showMarkAsUndoneButton && (
              <View style={styles.buttonContainer}>
                <CustomButton
                  style={styles.button}
                  textStyle={styles.buttonText}
                  onPress={() => {
                    currentCommitment.currentEpisode = 0;
                    currentCommitment.status = "yet to watch";
                    dispatch(
                      updateCommitment(
                        new Commitment(
                          currentCommitment.name,
                          currentCommitment.imgUri,
                          currentCommitment.imgLocal,
                          currentCommitment.totalEpisodes,
                          currentCommitment.currentEpisode,
                          currentCommitment.category,
                          currentCommitment.description,
                          currentCommitment.status,
                          currentCommitment.type,
                          currentCommitment.id
                        )
                      )
                    );
                  }}
                >
                  <Text>Unwatch</Text>
                </CustomButton>
              </View>
            )}
          </View>
          <View style={styles.deleteButtonContainer}>
            <CustomButton
              style={styles.button}
              textStyle={styles.buttonText}
              warning
              onPress={() => {
                Alert.alert(
                  "Confirm Deletion",
                  `Are you sure you want to delete the commitment: ${title(
                    currentCommitment.name
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
                        dispatch(deleteCommitment(currentCommitment.id));
                      },
                    },
                  ],
                  { userInterfaceStyle: "dark" }
                );
              }}
            >
              Delete Commitment
            </CustomButton>
          </View>
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
    backgroundColor: "#2c2c2c",
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
  },
  upperContainerDataContainer: { flex: 1, rowGap: 8, marginLeft: 5 },
  categoryText: {
    color: "white",
    fontSize: 26,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  plainText: {
    color: "rgb(126, 126, 126)",
    textTransform: "uppercase",
    fontSize: 16,
  },
  ["yet to watch"]: { color: "rgb(200, 20, 20)" },
  ["watching"]: { color: "rgb(200, 200, 20)" },
  ["finished"]: { color: "rgb(20, 200, 20)" },
  fieldTitle: {
    color: "rgb(126, 126, 126)",
    fontWeight: "bold",
    fontSize: 16,
  },
  middleContainer: { flex: 8 },
  descriptionTextContainer: { flex: 1, padding: 10, rowGap: 5, marginTop: 5 },
  descriptionText: { color: "white", textAlign: "justify", fontSize: 16 },
  lowerContainer: { flex: 5 },
  commitmentButtonsContainer: {
    flex: 1,
    justifyContent: "center",
    rowGap: "10%",
    borderTopColor: "rgba(255, 255, 255, 0.2)",
    borderTopWidth: 5,
    marginBottom: 10,
  },
  commitmentEpisodeButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    columnGap: 10,
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: "1.9%",
  },
  episodeText: {
    flex: 2,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
  },
  episodeCounter: {
    flex: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  totalEpisodesCount: {
    color: "white",
    fontSize: 24,
  },
  deleteButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 8,
    minWidth: "60%",
  },
  buttonText: {
    textAlign: "center",
  },
  noCommitmentsContainer: {
    margin: 10,
  },
  dimmedText: {
    color: "rgb(116, 116, 116)",
    textAlign: "left",
    fontSize: 14,
  },
  buttonsUpperContainer: {},
});
