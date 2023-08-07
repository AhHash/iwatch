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
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
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
import EpisodeCounter from "./EpisodeCounter";
import { placeholderImages } from "../../constants/data";
import { Item } from "react-navigation-header-buttons";
import { globalColors } from "../../constants/styles";

const ManageCommitment = ({ id, data }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { goBack, setOptions, navigate, pop } = useNavigation();

  const categories = useSelector((store) => store.categories.categories);
  const commitments = useSelector((store) => store.commitments.commitments);
  const selectedCommitment = useMemo(() => {
    return commitments.find((commitment) => commitment.id == id);
  }, [id, commitments]);

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
    setErrors([]);
  }, [id, isFocused, selectedCommitment]);

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
    if (selectedCommitment) {
      setInputCommitment({ ...selectedCommitment });
    } else {
      setInputCommitment({ ...new Commitment(), ...data });
    }
  }, [id, data, selectedCommitment]);

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

  const resetError = useCallback((errorName) => {
    setErrors((previousErrors) =>
      previousErrors.filter((error) => error != errorName)
    );
  }, []);

  const updateCommitmentHandler = useCallback((commitment) => {
    dispatch(
      updateCommitment(
        new Commitment(
          commitment.name,
          commitment.imgUri || placeholderImages.commitment,
          commitment.imgLocal,
          commitment.totalEpisodes,
          commitment.currentEpisode,
          commitment.category,
          commitment.description,
          commitment.status,
          commitment.type,
          commitment.id
        )
      )
    );
  }, []);

  const addCommitmentHandler = useCallback((commitment) => {
    dispatch(
      addCommitment(
        new Commitment(
          commitment.name,
          commitment.imgUri || placeholderImages.commitment,
          commitment.imgLocal,
          commitment.totalEpisodes,
          commitment.currentEpisode,
          commitment.category,
          commitment.description,
          commitment.status,
          commitment.type
        )
      )
    );
  }, []);

  const validateInputs = useCallback((commitment) => {
    for (const error of ["name", "category", "type", "status"]) {
      if (!commitment[error]) {
        setErrors((previousErrors) => {
          if (!errors.includes(error)) {
            return [...previousErrors, error];
          }
          return previousErrors;
        });
      }
    }

    if (
      !commitment.name ||
      !commitment.category ||
      !commitment.type ||
      !commitment.status
    ) {
      return false;
    }

    return true;
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
                  resetError("name");
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
              inputCommitment.type != "multi-episode" && {
                height: Dimensions.get("window").height / 5,
              },
            ]}
            multiline={true}
            value={inputCommitment.description}
            onChangeText={(text) => {
              resetError("description");
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
                    resetError("currentEpisode");
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
                if (validateInputs(inputCommitment)) {
                  if (selectedCommitment) {
                    updateCommitmentHandler(inputCommitment);
                  } else {
                    addCommitmentHandler(inputCommitment);
                  }
                  goBack();
                }
              }}
            >
              {selectedCommitment ? "Update" : "Add"} Commitment
            </CustomButton>

            {selectedCommitment && (
              <CustomButton
                warning
                style={styles.button}
                textStyle={styles.buttonText}
                onPress={() => {
                  Alert.alert(
                    "Confirm Deletion",
                    `Are you sure you want to delete the ${selectedCommitment.name}?`,
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
                          pop(2);
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
    borderBottomColor: globalColors.borderColor,
    borderBottomWidth: 4,
    columnGap: 20,
  },
  nameAndCategoryContainer: {
    flex: 1,
    rowGap: 15,
    justifyContent: "space-between",
  },
  inputText: {
    backgroundColor: globalColors.inputBackground,
    fontSize: 24,
    padding: 12,
    color: globalColors.textMain,
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
