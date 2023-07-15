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
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
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
import { globalColors } from "../../constants/styles";

const ManageCategory = ({ id }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { goBack } = useNavigation();

  const categories = useSelector((store) => store.categories.categories);
  const selectedCategory = useMemo(() => {
    return categories.find((category) => category.id == id);
  }, [id, isFocused]);

  const [inputCategory, setInputCategory] = useState({ ...new Category() });
  const [errors, setErrors] = useState([]);

  useLayoutEffect(() => {
    setErrors([]);
  }, [id, isFocused]);

  useEffect(() => {
    if (selectedCategory) {
      setInputCategory({ ...selectedCategory });
    } else {
      setInputCategory({ ...new Category() });
    }
  }, [id, selectedCategory, isFocused]);

  const validateInputs = useCallback((commitment) => {
    for (const error of ["name", "img", "colorCode"]) {
      if (!commitment[error]) {
        setErrors((previousErrors) => {
          if (!errors.includes(error)) {
            return [...previousErrors, error];
          }
          return previousErrors;
        });
      }
    }

    if (!commitment.name || !commitment.colorCode || !commitment.img) {
      return false;
    }

    return true;
  }, []);

  const submitInputs = useCallback(() => {
    if (selectedCategory) {
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
    goBack();
  }, [inputCategory, selectedCategory]);

  const resetError = useCallback((errorName) => {
    setErrors((previousErrors) =>
      previousErrors.filter((error) => error != errorName)
    );
  }, []);

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
              resetError("name");
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
              errors.includes("colorCode") && styles.warningText,
            ]}
          >
            Pick a color for your cateogry
          </Text>
          <CategoryColorList
            style={{ marginTop: 10 }}
            padding={10}
            initialColor={inputCategory.colorCode}
            onPickColor={(color) => {
              resetError("colorCode");
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
              errors.includes("img") && styles.warningText,
            ]}
          >
            Category Image
          </Text>
          <CategoryImagePicker
            initialImage={inputCategory.img}
            onPickImage={(image) => {
              resetError("img");
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
                if (validateInputs(inputCategory)) {
                  submitInputs();
                }
              }}
            >
              {selectedCategory ? "Update" : "Add"} Category
            </CustomButton>

            {selectedCategory && (
              <CustomButton
                warning
                style={styles.button}
                textStyle={styles.buttonText}
                onPress={() => {
                  Alert.alert(
                    "Confirm Deletion",
                    `Are you sure you want to delete the ${selectedCategory.name} category?`,
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
    borderBottomColor: globalColors.borderColor,
    borderBottomWidth: 4,
  },
  rowTitle: {
    color: globalColors.textMain,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  warningText: {
    color: globalColors.textWarning,
  },
  inputText: {
    backgroundColor: globalColors.inputBackground,
    fontSize: 24,
    padding: 12,
    color: globalColors.textMain,
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
