import {
  FlatList,
  Text,
  StyleSheet,
  Pressable,
  View,
  ImageBackground,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

import CustomButton from "../ui/CustomButton";
import {
  deleteCommitment,
  updateCommitment,
} from "../../features/commitments/commitmentsThunk";
import EpisodeCounter from "./EpisodeCounter";
import Commitment from "../../models/Commitment";
import { useCallback, useMemo } from "react";
import { title } from "../../util/format";

const CommitmentsList = ({
  data,
  filters: {
    category: sortCategory = "all",
    type: sortType = "all",
    status: sortStatus = "all",
  } = {},
  showCategories,
  showButtons,
  fixed,
  style,
  random,
  sort,
  readOnlyInput,
  showAddOnEmpty,
  addOnEmptyText,
  redirectData,
  itemOnPress,
  reverse,
  hideStatus,
}) => {
  const { navigate } = useNavigation();

  const { isEditing } = useSelector((store) => store.commitments);
  const categories = useSelector((store) => store.categories.categories);
  const dispatch = useDispatch();

  let baseCommitments = data
    ? [...data]
    : [...useSelector((store) => store.commitments.commitments)];

  if (sortCategory && sortCategory != "all") {
    baseCommitments = baseCommitments.filter(
      (commitment) => commitment.category == sortCategory
    );
  }

  if (sortType && sortType != "all") {
    baseCommitments = baseCommitments.filter(
      (commitment) => commitment.type == sortType
    );
  }

  if (sortStatus && sortStatus != "all") {
    baseCommitments = baseCommitments.filter(
      (commitment) => commitment.status == sortStatus
    );
  }

  switch (sort) {
    case "status":
      baseCommitments.sort((a, b) => {
        a = a.status == "watching" ? 3 : a.status == "yet to watch" ? 2 : 1;
        b = b.status == "watching" ? 3 : b.status == "yet to watch" ? 2 : 1;
        return b - a;
      });
      break;
    case "category":
      baseCommitments.sort((a, b) => b.category - a.category);
      break;
    default:
      if (!reverse) {
        baseCommitments.reverse();
      }
  }

  let visibleCommitments = [...baseCommitments];

  const getRandomCommitments = useCallback(
    (previousCommitments) => {
      return [
        ...previousCommitments.map((commitment) => commitment.id),
        ...baseCommitments
          .map((commitment) => [commitment, Math.random()])
          .sort((a, b) => (a[1] < b[1] ? 1 : -1))
          .map((commitment) => commitment[0].id),
      ].slice(0, Math.min(random || Infinity, baseCommitments.length));
    },
    [baseCommitments.length]
  );

  const randomCommitments = useMemo(() => {
    return getRandomCommitments(visibleCommitments);
  }, [visibleCommitments]);

  if (random) {
    visibleCommitments = visibleCommitments.filter((commitment) =>
      randomCommitments.includes(commitment.id)
    );
  }

  if (baseCommitments.length <= 0) {
    return (
      <View style={styles.noCommitmentsContainer}>
        <Text style={styles.noCommitmentsText}>
          {addOnEmptyText ||
            "Oops! No commitments to show here. Consider adding some!"}
        </Text>
        {showAddOnEmpty && (
          <CustomButton
            style={styles.noCommitmentsButton}
            onPress={() => {
              navigate("Manage", {
                mode: "add",
                type: "commitment",
                data: redirectData,
              });
            }}
          >
            Add New Commitment
          </CustomButton>
        )}
      </View>
    );
  }

  return (
    <FlatList
      bounces={!fixed}
      style={[{ zIndex: -3, borderRadius: 5, overflow: "hidden" }, style]}
      showsVerticalScrollIndicator={false}
      data={visibleCommitments}
      renderItem={({ item }) => {
        const category = categories.find(
          (category) => category.id == item.category
        );

        const showDeleteButton = showButtons;
        const showEpisodesButtons =
          item.type != "movie" && item.status == "watching";
        const showWatchButtons =
          item.type != "movie" && item.status == "yet to watch";
        const showRewatchButton =
          item.type != "movie" && item.status == "finished";
        const showMarkAsUndoneButton =
          item.type == "movie" && item.status == "finished";
        const showMarkAsDoneButton =
          item.type == "movie" &&
          (item.status == "watching" || item.status == "yet to watch");

        return (
          <View
            style={[
              styles.commitmentContainer,
              { height: showButtons ? 150 : 90 },
            ]}
          >
            <Pressable
              style={styles.commitmentData}
              onPress={
                itemOnPress
                  ? () => {
                      itemOnPress(item);
                    }
                  : () => {
                      if (isEditing) {
                        navigate("Manage", {
                          mode: "edit",
                          type: "commitment",
                          id: item.id,
                        });
                      } else {
                        navigate("Commitment", { id: item.id });
                      }
                    }
              }
            >
              <ImageBackground
                style={styles.commitmentImage}
                source={
                  typeof item.imgUri == "number"
                    ? item.imgUri
                    : { uri: item.imgUri }
                }
              >
                <LinearGradient
                  colors={["transparent", "rgba(0, 0, 0, 0.2)"]}
                  style={styles.commitmentGradient}
                >
                  {isEditing && (
                    <View style={styles.editTextContainer}>
                      <Text style={styles.editText}>Tab To Edit</Text>
                    </View>
                  )}
                </LinearGradient>
              </ImageBackground>
              <View
                style={[
                  styles.commitmentTextContainer,
                  hideStatus && { justifyContent: "space-evenly" },
                ]}
              >
                <Text style={styles.nameText}>
                  {item.name.length >= 30
                    ? item.name.slice(0, 31) + "..."
                    : item.name}
                  {item.date && (
                    <Text style={[styles.nameText, styles.yearText]}>
                      {` (${item.date})`}
                    </Text>
                  )}
                </Text>

                <Text style={styles.textLight}>{item.type}</Text>
                {!hideStatus && (
                  <Text style={[styles.text, styles[item.status]]}>
                    {item.status}
                  </Text>
                )}
              </View>
              {showCategories && (
                <View
                  style={[
                    styles.categoryView,
                    { backgroundColor: category?.colorCode },
                  ]}
                >
                  <View style={styles.categoryOverlay}>
                    <Text style={styles.categoryText}>
                      {category ? category.name[0].toUpperCase() : "N"}
                    </Text>
                  </View>
                </View>
              )}
            </Pressable>
            {showButtons && (
              <View style={styles.commitmentButtonsContainer}>
                {showEpisodesButtons && (
                  <View style={styles.commitmentEpisodeButtonsContainer}>
                    <Text style={styles.episodeText}>Current Episode</Text>
                    <View style={styles.episodeCounter}>
                      <EpisodeCounter
                        readOnlyInput={readOnlyInput}
                        initialValue={item.currentEpisode}
                        onValueChange={(value) => {
                          if (value >= item.totalEpisodes) {
                            item.status = "finished";
                          }
                          dispatch(
                            updateCommitment(
                              new Commitment(
                                item.name,
                                item.imgUri,
                                item.imgLocal,
                                item.totalEpisodes,
                                item.currentEpisode,
                                item.category,
                                item.description,
                                item.status,
                                item.type,
                                item.id
                              )
                            )
                          );
                        }}
                        upperLimit={item.totalEpisodes}
                      />
                      <Text
                        style={styles.totalEpisodesCount}
                      >{`/ ${item.totalEpisodes}`}</Text>
                    </View>
                  </View>
                )}

                {showRewatchButton && (
                  <View style={styles.buttonContainer}>
                    <CustomButton
                      style={styles.button}
                      textStyle={styles.buttonText}
                      onPress={() => {
                        item.currentEpisode = 0;
                        item.status = "watching";
                        dispatch(
                          updateCommitment(
                            new Commitment(
                              item.name,
                              item.imgUri,
                              item.imgLocal,
                              item.totalEpisodes,
                              item.currentEpisode,
                              item.category,
                              item.description,
                              item.status,
                              item.type,
                              item.id
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
                        item.currentEpisode = 0;
                        item.status = "watching";
                        dispatch(
                          updateCommitment(
                            new Commitment(
                              item.name,
                              item.imgUri,
                              item.imgLocal,
                              item.totalEpisodes,
                              item.currentEpisode,
                              item.category,
                              item.description,
                              item.status,
                              item.type,
                              item.id
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
                        item.currentEpisode = item.totalEpisodes;
                        item.status = "finished";
                        dispatch(
                          updateCommitment(
                            new Commitment(
                              item.name,
                              item.imgUri,
                              item.imgLocal,
                              item.totalEpisodes,
                              item.currentEpisode,
                              item.category,
                              item.description,
                              item.status,
                              item.type,
                              item.id
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
                        item.currentEpisode = 0;
                        item.status = "yet to watch";
                        dispatch(
                          updateCommitment(
                            new Commitment(
                              item.name,
                              item.imgUri,
                              item.imgLocal,
                              item.totalEpisodes,
                              item.currentEpisode,
                              item.category,
                              item.description,
                              item.status,
                              item.type,
                              item.id
                            )
                          )
                        );
                      }}
                    >
                      <Text>Unwatch</Text>
                    </CustomButton>
                  </View>
                )}

                {showDeleteButton && (
                  <View style={styles.deleteButtonContainer}>
                    <CustomButton
                      style={styles.deleteButton}
                      textStyle={styles.buttonText}
                      warning
                      onPress={() => {
                        Alert.alert(
                          "Confirm Deletion",
                          `Are you sure you want to delete the commitment: ${title(
                            item.name
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
                                dispatch(deleteCommitment(item.id));
                              },
                            },
                          ],
                          { userInterfaceStyle: "dark" }
                        );
                      }}
                    >
                      <Ionicons name="trash" size={24} />
                    </CustomButton>
                  </View>
                )}
              </View>
            )}
          </View>
        );
      }}
    />
  );
};
export default CommitmentsList;

const styles = StyleSheet.create({
  commitmentContainer: {
    width: "100%",
    position: "relative",
    borderRadius: 5,
    height: 150,
    overflow: "hidden",
    marginVertical: 5,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  commitmentData: {
    flexDirection: "row",
    flex: 2,
  },
  commitmentImage: {
    height: "100%",
    flex: 1,
  },
  commitmentGradient: {
    flex: 1,
    justifyContent: "center",
  },
  commitmentTextContainer: {
    flex: 3,
    margin: 10,
    justifyContent: "space-between",
  },
  nameText: { color: "white", fontSize: 18, textTransform: "capitalize" },
  yearText: {
    color: "rgb(100, 100, 100)",
  },
  text: {
    color: "white",
  },
  textLight: {
    color: "rgb(100, 100, 100)",
    textTransform: "capitalize",
  },
  ["yet to watch"]: { color: "rgb(200, 20, 20)" },
  ["watching"]: { color: "rgb(200, 200, 20)" },
  ["finished"]: { color: "rgb(20, 200, 20)" },
  categoryView: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 30,
    height: "100%",
    justifyContent: "center",
    borderRadius: 4,
    overflow: "hidden",
  },
  categoryOverlay: {
    backgroundColor: "rgba(20, 20, 20, 0.25)",
    alignSelf: "stretch",
    height: "100%",
    justifyContent: "center",
  },
  categoryText: {
    fontSize: 25,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  editTextContainer: {
    flex: 1,
    backgroundColor: "rgba(30, 30, 30, 0.5)",
    justifyContent: "center",
  },
  editText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    opacity: 0.7,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  commitmentButtonsContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 5,
    marginTop: 5,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
    borderTopWidth: 2,
    alignItems: "center",
  },
  commitmentEpisodeButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    columnGap: 10,
    alignItems: "center",
    flex: 4,
    marginHorizontal: 10,
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderLeftColor: "rgba(255, 255, 255, 0.2)",
    borderLeftWidth: 2,
  },
  deleteButton: { padding: 8 },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 8,
    minWidth: "80%",
  },
  buttonText: {
    textAlign: "center",
    textTransform: "capitalize",
  },
  noCommitmentsText: {
    color: "rgb(126, 126, 126)",
    marginTop: 20,
    fontSize: 18,
    textAlign: "center",
  },
  noCommitmentsContainer: {
    margin: 10,
    rowGap: 20,
  },
  noCommitmentsButton: {
    alignSelf: "center",
  },
});
