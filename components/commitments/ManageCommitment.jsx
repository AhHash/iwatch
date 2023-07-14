import {
  TextInput,
  View,
  StyleSheet,
  Dimensions,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";

import Commitment from "../../models/Commitment";
import RowTitle from "../ui/RowTitle";
import CommitmentImagePicker from "./CommitmentImagePicker";
import DropDownPicker from "./DropDownPicker";
import CustomButton from "../ui/CustomButton";
import {
  addCommitment,
  updateCommitment,
  deleteCommitment,
} from "../../features/commitments/commitmentsThunk";
import {
  selectCommitment,
  setIsEditing,
} from "../../features/commitments/commitmentsSlice";
import EpisodeCounter from "./EpisodeCounter";
import { placeholderImages } from "../../constants/data";
import { Item } from "react-navigation-header-buttons";

const ManageCommitment = ({ id, data }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { goBack, setOptions, navigate } = useNavigation();

  const { selectedCommitment, isEditing } = useSelector(
    (store) => store.commitments
  );

  const { categories } = useSelector((store) => store.categories);

  const [inputCommitment, setInputCommitment] = useState({
    ...new Commitment(),
    ...data,
  });
  const [errors, setErrors] = useState([]);
  const [openPickers, setOpenPickers] = useState({
    category: false,
    type: false,
    status: false,
  });

  const [isKeyboardViewActive, setIsKeyboardViewActive] = useState(false);
  const [isTextInputsDisabled, setIsTextInputsDisabled] = useState(false);

  useLayoutEffect(() => {
    if (isEditing) {
      dispatch(selectCommitment(id));
    }
    setErrors([]);
  }, [id, isFocused, isEditing]);

  useLayoutEffect(() => {
    setOptions({
      headerRight: () => {
        return (
          <Item
            iconName="search"
            IconComponent={Ionicons}
            iconSize={28}
            onPress={() => {
              navigate("Fetch");
            }}
          />
        );
      },
    });
  }, []);

  useEffect(() => {
    if (isEditing) {
      setInputCommitment({ ...selectedCommitment });
    } else {
      setInputCommitment({ ...new Commitment(), ...data });
    }
  }, [id, data, isEditing, selectedCommitment]);

  useEffect(() => {
    if (
      inputCommitment.type == "movie" &&
      inputCommitment.status == "watching"
    ) {
      setInputCommitment((previousValues) => {
        return { ...previousValues, status: null };
      });
    }
  }, [inputCommitment]);

  const togglePickersExcept = useCallback((targetPicker) => {
    setOpenPickers((previousPickers) => {
      const updatedPickers = { ...previousPickers };
      for (const picker of Object.keys(updatedPickers)) {
        if (picker == targetPicker) {
          updatedPickers[picker] = !updatedPickers[picker];
        } else {
          updatedPickers[picker] = false;
        }
      }
      return updatedPickers;
    });
  }, []);

  return (
    <ScrollView style={styles.container} bounces={false}>
      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={130}
        enabled={isKeyboardViewActive}
      >
        <View style={[styles.row, { flexDirection: "row" }]}>
          <View style={styles.imageContainer}>
            <RowTitle title="Image" error="image" errors={errors} />
            <CommitmentImagePicker
              initialImage={inputCommitment.imgUri}
              onPickImage={(image) => {
                // setErrors((previousErrors) =>
                //   previousErrors.filter((error) => error != "image")
                // );
                setInputCommitment((previousCommitment) => ({
                  ...previousCommitment,
                  imgUri: image,
                  imgLocal: 1,
                }));
              }}
            />
          </View>
          <View style={styles.nameAndCategoryContainer}>
            <View>
              <RowTitle title="Commitment Name" error="name" errors={errors} />
              <TextInput
                readOnly={isTextInputsDisabled}
                style={styles.inputText}
                value={inputCommitment.name}
                autoCapitalize="words"
                onChangeText={(text) => {
                  setErrors((previousErrors) =>
                    previousErrors.filter((error) => error != "name")
                  );
                  setInputCommitment((previousCommitment) => ({
                    ...previousCommitment,
                    name: text,
                  }));
                }}
              />
            </View>
            <View>
              <RowTitle
                title="Commitment Category"
                error="category"
                errors={errors}
              />
              <DropDownPicker
                data={categories}
                name="category"
                togglePickersExcept={togglePickersExcept}
                setPickerValues={setInputCommitment}
                pickerValues={inputCommitment}
                open={openPickers.category}
                setErrors={setErrors}
              />
            </View>
          </View>
        </View>
        <View style={[styles.row, { zIndex: -1 }]}>
          <RowTitle
            title="Commitment Description"
            error="description"
            errors={errors}
          />
          <TextInput
            readOnly={isTextInputsDisabled}
            style={[
              styles.inputText,
              styles.textArea,
              inputCommitment.type == "movie" && {
                height: Dimensions.get("window").height / 5,
              },
            ]}
            multiline={true}
            value={inputCommitment.description}
            onChangeText={(text) => {
              setErrors((previousErrors) =>
                previousErrors.filter((error) => error != "description")
              );
              setInputCommitment((previousCommitment) => ({
                ...previousCommitment,
                description: text,
              }));
            }}
          />
        </View>
        <View style={[styles.row, { rowGap: 2 }]}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              zIndex: openPickers.status ? -2 : -1,
            }}
          >
            <RowTitle
              title="Commitment Type"
              error="type"
              errors={errors}
              inline
            />
            <View
              style={{
                flex: 1,
                maxWidth: Dimensions.get("window").width / 2.25,
                alignItems: "center",
              }}
            >
              <DropDownPicker
                data={["multi-episode", "movie"]}
                name="type"
                togglePickersExcept={togglePickersExcept}
                setPickerValues={setInputCommitment}
                pickerValues={inputCommitment}
                open={openPickers.type}
                setErrors={setErrors}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              zIndex: openPickers.type ? -2 : -1,
            }}
          >
            <RowTitle
              title="Commitment Status"
              error="status"
              errors={errors}
              inline
            />
            <View
              style={{
                flex: 1,
                maxWidth: Dimensions.get("window").width / 2.25,
              }}
            >
              <DropDownPicker
                data={
                  inputCommitment.type == "movie"
                    ? ["yet to watch", "finished"]
                    : ["yet to watch", "watching", "finished"]
                }
                name="status"
                togglePickersExcept={togglePickersExcept}
                setPickerValues={setInputCommitment}
                pickerValues={inputCommitment}
                open={openPickers.status}
                setErrors={setErrors}
              />
            </View>
          </View>
        </View>
        {inputCommitment.type == "multi-episode" && (
          <View style={[styles.row, { zIndex: -3 }]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1, alignItems: "center" }}>
                <RowTitle
                  title="Total Episode Count"
                  error="totalEpisodes"
                  errors={errors}
                />
                <EpisodeCounter
                  onFocus={() => {
                    setIsKeyboardViewActive(true);
                    setIsTextInputsDisabled(true);
                  }}
                  onEnd={() => {
                    Keyboard.dismiss();
                    setTimeout(() => {
                      setIsKeyboardViewActive(false);
                      setIsTextInputsDisabled(false);
                    }, 100);
                  }}
                  onValueChange={(totalEpisodes) => {
                    setErrors((previousErrors) =>
                      previousErrors.filter((error) => error != "totalEpisodes")
                    );
                    setInputCommitment((previousCommitment) => {
                      return { ...previousCommitment, totalEpisodes };
                    });
                  }}
                  initialValue={inputCommitment.totalEpisodes}
                />
              </View>
              <View style={{ flex: 1, alignItems: "center" }}>
                <RowTitle
                  title="Current Episode"
                  error="currentEpisode"
                  errors={errors}
                />
                <EpisodeCounter
                  onFocus={() => {
                    setIsKeyboardViewActive(true);
                    setIsTextInputsDisabled(true);
                  }}
                  onEnd={() => {
                    Keyboard.dismiss();
                    setTimeout(() => {
                      setIsKeyboardViewActive(false);
                      setIsTextInputsDisabled(false);
                    }, 100);
                  }}
                  fixedValue={
                    inputCommitment.status == "finished"
                      ? inputCommitment.totalEpisodes
                      : inputCommitment.status == "yet to watch" && 0
                  }
                  initialValue={inputCommitment.currentEpisode}
                  disabled={inputCommitment.status != "watching"}
                  upperLimit={inputCommitment.totalEpisodes - 1}
                  onValueChange={(currentEpisode) => {
                    setErrors((previousErrors) =>
                      previousErrors.filter(
                        (error) => error != "currentEpisode"
                      )
                    );
                    setInputCommitment((previousCommitment) => {
                      return { ...previousCommitment, currentEpisode };
                    });
                  }}
                />
              </View>
            </View>
          </View>
        )}

        <View style={styles.buttonsContainerContainer}>
          <View style={styles.buttonsContainer}>
            <CustomButton
              style={styles.button}
              textStyle={styles.buttonText}
              onPress={() => {
                if (!inputCommitment.name) {
                  setErrors((previousErrors) => {
                    if (!errors.includes("name")) {
                      return [...previousErrors, "name"];
                    }
                    return previousErrors;
                  });
                }
                if (!inputCommitment.category) {
                  setErrors((previousErrors) => {
                    if (!errors.includes("category")) {
                      return [...previousErrors, "category"];
                    }
                    return previousErrors;
                  });
                }
                // if (!inputCommitment.imgUri) {
                //   setErrors((previousErrors) => {
                //     if (!errors.includes("image")) {
                //       return [...previousErrors, "image"];
                //     }
                //     return previousErrors;
                //   });
                // }
                if (!inputCommitment.type) {
                  setErrors((previousErrors) => {
                    if (!errors.includes("type")) {
                      return [...previousErrors, "type"];
                    }
                    return previousErrors;
                  });
                }
                if (!inputCommitment.status) {
                  setErrors((previousErrors) => {
                    if (!errors.includes("status")) {
                      return [...previousErrors, "status"];
                    }
                    return previousErrors;
                  });
                }

                if (
                  !inputCommitment.name ||
                  !inputCommitment.category ||
                  // !inputCommitment.imgUri ||
                  !inputCommitment.type ||
                  !inputCommitment.status
                ) {
                  return;
                }

                if (isEditing) {
                  dispatch(
                    updateCommitment(
                      new Commitment(
                        inputCommitment.name,
                        inputCommitment.imgUri || placeholderImages.commitment,
                        inputCommitment.imgLocal,
                        inputCommitment.totalEpisodes,
                        inputCommitment.currentEpisode,
                        inputCommitment.category,
                        inputCommitment.description,
                        inputCommitment.status,
                        inputCommitment.type,
                        inputCommitment.id
                      )
                    )
                  );
                } else {
                  dispatch(
                    addCommitment(
                      new Commitment(
                        inputCommitment.name,
                        inputCommitment.imgUri || placeholderImages.commitment,
                        inputCommitment.imgLocal,
                        inputCommitment.totalEpisodes,
                        inputCommitment.currentEpisode,
                        inputCommitment.category,
                        inputCommitment.description,
                        inputCommitment.status,
                        inputCommitment.type
                      )
                    )
                  );
                }
                dispatch(setIsEditing(false));
                goBack();
              }}
            >
              {isEditing ? "Update" : "Add"} Commitment
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
                          dispatch(deleteCommitment(id));
                          dispatch(setIsEditing(false));
                          goBack();
                        },
                      },
                    ],
                    { userInterfaceStyle: "dark" }
                  );
                }}
              >
                Delete Commitment
              </CustomButton>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default ManageCommitment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  row: {
    paddingVertical: 15,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    borderBottomWidth: 4,
    columnGap: 20,
  },
  nameAndCategoryContainer: {
    flex: 1,
    rowGap: 15,
    justifyContent: "space-between",
  },
  inputText: {
    backgroundColor: "#2c2c2c",
    fontSize: 24,
    padding: 12,
    color: "white",
  },
  textArea: {
    width: "100%",
    fontSize: 16,
    height: Dimensions.get("window").height / 11,
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
    marginTop: 20,
    flexDirection: "column-reverse",
    // marginBottom: Dimensions.get("screen").height / 12,
    zIndex: -3,
  },
});
