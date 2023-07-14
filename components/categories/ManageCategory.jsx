import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Dimensions,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Category from "../../models/Category";
import CategoryImagePicker from "./CategoryImagePicker";
import CategoryColorList from "./CategoryColorList";
import CustomButton from "../ui/CustomButton";
import {
  addCategory,
  deleteCategory,
  updateCategory,
} from "../../features/categories/categoriesthunk";
import {
  selectCategory,
  setIsEditing,
} from "../../features/categories/categoriesSlice";

const ManageCategory = ({ id }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { goBack } = useNavigation();

  const { selectedCategory, isEditing } = useSelector(
    (store) => store.categories
  );

  const [inputCategory, setInputCategory] = useState({ ...new Category() });
  const [errors, setErrors] = useState([]);

  useLayoutEffect(() => {
    if (isEditing) {
      dispatch(selectCategory(id));
    }
    setErrors([]);
  }, [id, isFocused, isEditing]);

  useEffect(() => {
    if (isEditing) {
      setInputCategory({ ...selectedCategory });
    } else {
      setInputCategory({ ...new Category() });
    }
  }, [id, isEditing, selectedCategory]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.row}>
          <Text
            style={[
              styles.rowTitle,
              errors.includes("name") && styles.warningText,
            ]}
          >
            Category Name
          </Text>
          <TextInput
            style={styles.inputText}
            value={inputCategory.name}
            onChangeText={(text) => {
              setErrors((previousErrors) =>
                previousErrors.filter((error) => error != "name")
              );
              setInputCategory((previousCategory) => ({
                ...previousCategory,
                name: text,
              }));
            }}
          />
        </View>
        <View style={styles.row}>
          <Text
            style={[
              styles.rowTitle,
              errors.includes("color") && styles.warningText,
            ]}
          >
            Pick a color for your cateogry
          </Text>
          <CategoryColorList
            style={{ marginTop: 10 }}
            padding={10}
            initialColor={inputCategory.colorCode}
            onPickColor={(color) => {
              setErrors((previousErrors) =>
                previousErrors.filter((error) => error != "color")
              );
              setInputCategory((previousCategory) => ({
                ...previousCategory,
                colorCode: color,
              }));
            }}
          />
        </View>
        <View style={styles.row}>
          <Text
            style={[
              styles.rowTitle,
              errors.includes("image") && styles.warningText,
            ]}
          >
            Category Image
          </Text>
          <CategoryImagePicker
            initialImage={inputCategory.img}
            onPickImage={(image) => {
              setErrors((previousErrors) =>
                previousErrors.filter((error) => error != "image")
              );
              setInputCategory((previousCategory) => ({
                ...previousCategory,
                img: image,
              }));
            }}
          />
        </View>
        <View style={styles.buttonsContainerContainer}>
          <View style={styles.buttonsContainer}>
            <CustomButton
              style={styles.button}
              textStyle={styles.buttonText}
              onPress={() => {
                if (!inputCategory.name) {
                  setErrors((previousErrors) => {
                    if (!errors.includes("name")) {
                      return [...previousErrors, "name"];
                    }
                    return previousErrors;
                  });
                }
                if (!inputCategory.colorCode) {
                  setErrors((previousErrors) => {
                    if (!errors.includes("image")) {
                      return [...previousErrors, "image"];
                    }
                    return previousErrors;
                  });
                }
                if (!inputCategory.img) {
                  setErrors((previousErrors) => {
                    if (!errors.includes("color")) {
                      return [...previousErrors, "color"];
                    }
                    return previousErrors;
                  });
                }

                if (
                  !inputCategory.name ||
                  !inputCategory.colorCode ||
                  !inputCategory.img
                ) {
                  return;
                }

                if (isEditing) {
                  dispatch(
                    updateCategory(
                      new Category(
                        inputCategory.name,
                        inputCategory.colorCode,
                        inputCategory.img,
                        id
                      )
                    )
                  );
                } else {
                  dispatch(
                    addCategory(
                      new Category(
                        inputCategory.name,
                        inputCategory.colorCode,
                        inputCategory.img
                      )
                    )
                  );
                }
                dispatch(setIsEditing(false));
                goBack();
              }}
            >
              {isEditing ? "Update" : "Add"} Category
            </CustomButton>

            {isEditing && (
              <CustomButton
                warning
                style={styles.button}
                textStyle={styles.buttonText}
                onPress={() => {
                  Alert.alert(
                    "Confirm Deletion",
                    `Are you sure you want to delete the ${selectedCategory.name}?`,
                    [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: () => {
                          dispatch(deleteCategory(id));
                          dispatch(setIsEditing(false));
                          goBack();
                        },
                      },
                    ],
                    { userInterfaceStyle: "dark" }
                  );
                }}
              >
                Delete Category
              </CustomButton>
            )}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ManageCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  row: {
    paddingVertical: 25,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    borderBottomWidth: 4,
  },
  rowTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  warningText: {
    color: "rgb(231, 105, 105)",
  },
  inputText: {
    backgroundColor: "#2c2c2c",
    fontSize: 24,
    padding: 12,
    color: "white",
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-evenly",
    width: "100%",
  },
  button: {
    flex: 1,
  },

  buttonText: {
    textAlign: "center",
  },
  buttonsContainerContainer: {
    flex: 1,
    marginHorizontal: 20,
    flexDirection: "column-reverse",
    marginBottom: Dimensions.get("screen").height / 14,
  },
});
