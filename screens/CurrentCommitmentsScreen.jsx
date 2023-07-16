import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";

import CommitmentsList from "../components/commitments/CommitmentsList";
import { globalColors } from "../constants/styles";

const CurrentCommitmentsScreen = () => {
  const { height } = useWindowDimensions();

  const commitments = useSelector((store) => store.commitments.commitments);

  return (
    <View style={styles.container} bounces={false}>
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
          showAddOnEmpty={commitments.length == 0}
          addOnEmptyText={
            commitments.length != 0 &&
            "Oops! No commitments to show here. Consider watching some!"
          }
          noBack
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
            noBack
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
    color: globalColors.textMain,
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
    color: globalColors.textMain,
  },
  divider: {
    borderTopColor: globalColors.borderColor,
    borderTopWidth: 5,
  },
  watchListContainer: {},
});
