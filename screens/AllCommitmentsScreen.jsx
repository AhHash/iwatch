import { useLayoutEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { setIsEditing } from "../features/commitments/commitmentsSlice";
import { Item } from "react-navigation-header-buttons";
import HeaderAddButton from "../components/ui/HeaderAddButton";
import HeaderSearchButton from "../components/commitments/HeaderSearchButton";
import CommitmentsList from "../components/commitments/CommitmentsList";
import SearchContianer from "../components/commitments/SearchContianer";

const AllCommitmentsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { isEditing } = useSelector((store) => store.commitments);

  const [isSearching, setIsSearching] = useState(false);
  const [searchInputs, setSearchInputs] = useState({});

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <Item
            title={isEditing ? "Editing" : "Edit"}
            style={{ marginLeft: 20 }}
            onPress={() => {
              dispatch(setIsEditing(!isEditing));
            }}
          />
        );
      },
      headerRight: () => {
        return (
          <View
            style={{
              flexDirection: "row",
              columnGap: 15,
              alignItems: "center",
            }}
          >
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
        showCategories
        sort={searchInputs.sort}
        showAddOnEmpty
      />
    </View>
  );
};

export default AllCommitmentsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
});
