import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "../features/categories/categoriesthunk";
import { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Item } from "react-navigation-header-buttons";

import CategoriesList from "../components/categories/CategoriesList";

const CategoriesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <Item
            title={isEditing ? "Editing" : "Edit"}
            style={{ marginLeft: 20 }}
            onPress={() => {
              setIsEditing(!isEditing);
            }}
          />
        );
      },
    });
  }, [isEditing]);

  useEffect(() => {
    dispatch(getAllCategories());
  }, []);

  return (
    <View style={styles.container}>
      <CategoriesList isEditing={isEditing} />
    </View>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
});
