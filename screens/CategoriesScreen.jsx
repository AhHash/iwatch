import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "../features/categories/categoriesthunk";
import { useEffect, useLayoutEffect } from "react";
import CategoriesList from "../components/categories/CategoriesList";
import { StyleSheet, Text, View } from "react-native";
import { Item } from "react-navigation-header-buttons";
import { setIsEditing } from "../features/categories/categoriesSlice";

const CategoriesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { categories, error, errorMessage, isEditing } = useSelector(
    (store) => store.categories
  );

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
    });
  }, [isEditing]);

  useEffect(() => {
    dispatch(getAllCategories());
  }, []);

  return (
    <View style={styles.container}>
      {/* {error && <Text>{errorMessage}</Text>} */}
      <CategoriesList data={categories} />
    </View>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
});
