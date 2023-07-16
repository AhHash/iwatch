import {
  FlatList,
  Text,
  StyleSheet,
  Pressable,
  View,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";

import CustomButton from "../ui/CustomButton";
import { useCallback, useMemo } from "react";
import { getImgUri } from "../../util/format";
import CommitmentButtons from "./CommitmentButtons";
import CommitmentDeleteButton from "./CommitmentDeleteButton";
import { globalColors } from "../../constants/styles";

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
  noBack,
  isEditing,
  updater,
}) => {
  const { navigate } = useNavigation();

  const categories = useSelector((store) => store.categories.categories);

  let baseCommitments = [
    ...useSelector((store) => store.commitments.commitments),
  ];

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
      style={[styles.list, style]}
      showsVerticalScrollIndicator={false}
      data={visibleCommitments}
      renderItem={({ item: itemData }) => {
        const item = { ...itemData };

        const category = categories.find(
          (category) => category.id == item.category
        );

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
                source={getImgUri(item.imgUri)}
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
                <CommitmentButtons
                  commitment={item}
                  limitEpisodeContainer
                  readOnlyInput={readOnlyInput}
                />
                <CommitmentDeleteButton
                  commitment={item}
                  icon
                  limited
                  noBack={noBack}
                />
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
  list: {
    zIndex: -3,
    borderRadius: 5,
    overflow: "hidden",
  },
  commitmentContainer: {
    width: "100%",
    position: "relative",
    borderRadius: 5,
    height: 150,
    overflow: "hidden",
    marginVertical: 5,
    backgroundColor: globalColors.commitmentBackground,
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
  nameText: {
    color: globalColors.textMain,
    fontSize: 18,
    textTransform: "capitalize",
  },
  yearText: {
    color: "rgb(100, 100, 100)",
  },
  text: {
    color: globalColors.textMain,
  },
  textLight: {
    color: globalColors.textAccent,
    textTransform: "capitalize",
  },
  ["yet to watch"]: { color: globalColors.yetToWatch },
  ["watching"]: { color: globalColors.watching },
  ["finished"]: { color: globalColors.finished },
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
    backgroundColor: globalColors.overlay,
    alignSelf: "stretch",
    height: "100%",
    justifyContent: "center",
  },
  categoryText: {
    fontSize: 25,
    color: globalColors.textMain,
    textAlign: "center",
    fontWeight: "bold",
  },
  editTextContainer: {
    flex: 1,
    backgroundColor: globalColors.overlay,
    justifyContent: "center",
  },
  editText: {
    color: globalColors.textMain,
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
    borderTopColor: globalColors.borderColor,
    borderTopWidth: 2,
    alignItems: "center",
  },
  noCommitmentsText: {
    color: globalColors.textAccent,
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
