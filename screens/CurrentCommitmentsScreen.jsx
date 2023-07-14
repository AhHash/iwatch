import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import CommitmentsList from "../components/commitments/CommitmentsList";
import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
import { setIsEditing as setIsEditingCommitments } from "../features/commitments/commitmentsSlice";
import { setIsEditing as setIsEditingCategories } from "../features/categories/categoriesSlice";

const CurrentCommitmentsScreen = () => {
  const { height } = useWindowDimensions();
  const isFocused = useIsFocused();

  const { commitments } = useSelector((store) => store.commitments);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setIsEditingCommitments());
    dispatch(setIsEditingCategories());
  }, [isFocused]);

  return (
    <View style={[styles.container]} bounces={false}>
      <View style={styles.currentlyWatchingContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Continue where you last stopped</Text>
        </View>
        <CommitmentsList
          filters={{ status: "watching" }}
          random={2}
          fixed
          showButtons={height >= 800}
          showCategories
          readOnlyInput
          data={commitments}
          showAddOnEmpty={commitments.length == 0}
          addOnEmptyText={
            commitments.length != 0 &&
            "Oops! No commitments to show here. Consider watching some!"
          }
        />
      </View>
      <View style={styles.divider}></View>
      <View style={styles.watchContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleTextSecondary}>Watch Next</Text>
        </View>
        <View style={styles.watchListContainer}>
          <CommitmentsList
            filters={{ status: "yet to watch" }}
            random={1}
            fixed
            showButtons={height >= 700}
            showCategories
            readOnlyInput
            data={commitments}
          />
        </View>
      </View>
    </View>
  );
};

export default CurrentCommitmentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  titleContainer: { marginBottom: 5 },
  titleText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  currentlyWatchingContainer: {
    flex: 11,
  },
  watchContainer: {
    flex: 6,
    justifyContent: "center",
  },
  titleTextSecondary: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  divider: {
    borderTopColor: "rgba(255, 255, 255, 0.2)",
    borderTopWidth: 5,
  },
  watchListContainer: {},
});
