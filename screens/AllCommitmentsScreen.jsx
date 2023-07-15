import { useLayoutEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Item } from "react-navigation-header-buttons";
import HeaderAddButton from "../components/ui/HeaderAddButton";
import HeaderSearchButton from "../components/commitments/HeaderSearchButton";
import CommitmentsList from "../components/commitments/CommitmentsList";
import SearchContianer from "../components/commitments/SearchContianer";

const AllCommitmentsScreen = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchInputs, setSearchInputs] = useState({});

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <Item
            title={isEditing ? "Editing" : "Edit"}
            style={styles.editButton}
            onPress={() => {
              setIsEditing(!isEditing);
            }}
          />
        );
      },
      headerRight: () => {
        return (
          <View style={styles.searchButtonContainer}>
            <HeaderSearchButton
              onSelect={() => {
                setIsSearching((previousValue) => {
                  if (previousValue) {
                    setSearchInputs({});
                  }
                  return !previousValue;
                });
              }}
            />
            <HeaderAddButton />
          </View>
        );
      },
    });
  }, [isEditing]);

  return (
    <View style={styles.container}>
      {isSearching && <SearchContianer onValueChange={setSearchInputs} />}
      <CommitmentsList
        filters={searchInputs}
        sort={searchInputs.sort}
        showCategories
        showAddOnEmpty
        isEditing={isEditing}
        noBack
      />
    </View>
  );
};

export default AllCommitmentsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  searchButtonContainer: {
    flexDirection: "row",
    columnGap: 15,
    alignItems: "center",
  },
  editButton: { marginLeft: 20 },
});
