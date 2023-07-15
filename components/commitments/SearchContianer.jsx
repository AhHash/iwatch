import { StyleSheet, Text, TextInput, View } from "react-native";
import { useCallback, useEffect, useState } from "react";

import DropDownPicker from "./DropDownPicker";
import { useSelector } from "react-redux";
import { globalColors } from "../../constants/styles";

const SearchContianer = ({ onValueChange }) => {
  const categories = useSelector((store) => store.categories.categories);

  const [searchInputs, setSearchInputs] = useState({
    category: null,
    type: null,
    status: null,
    sort: null,
  });

  const [openPickers, setOpenPickers] = useState({
    category: false,
    type: false,
    status: false,
    sort: false,
  });

  useEffect(() => {
    onValueChange(searchInputs);
  }, [searchInputs]);

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
    <View style={styles.container}>
      <View style={styles.upperContainer}>
        <View style={styles.textInputContainer}>
          <TextInput style={styles.textInput} placeholder="Type to search..." />
        </View>
        <View style={[styles.pickerContainer, styles.sortPickerContainer]}>
          <Text style={styles.text}>Status</Text>
          <DropDownPicker
            style={[
              styles.picker,
              !openPickers.status && { zIndex: -1 },
              styles.sortPicker,
            ]}
            data={["recent", "status", "category"]}
            name="sort"
            togglePickersExcept={togglePickersExcept}
            setPickerValues={setSearchInputs}
            pickerValues={searchInputs}
            open={openPickers.sort}
            hideIcons
          />
        </View>
      </View>
      <View style={styles.pickersContainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.text}>Category</Text>
          <DropDownPicker
            style={[styles.picker, !openPickers.category && { zIndex: -1 }]}
            data={["all", ...categories]}
            name="category"
            togglePickersExcept={togglePickersExcept}
            setPickerValues={setSearchInputs}
            pickerValues={searchInputs}
            open={openPickers.category}
            hideIcons
          />
        </View>
        <View style={styles.pickerContainer}>
          <Text style={styles.text}>Status</Text>
          <DropDownPicker
            style={[styles.picker, !openPickers.status && { zIndex: -1 }]}
            data={["all", "yet to watch", "watching", "finished"]}
            name="status"
            togglePickersExcept={togglePickersExcept}
            setPickerValues={setSearchInputs}
            pickerValues={searchInputs}
            open={openPickers.status}
            hideIcons
          />
        </View>
        <View style={styles.pickerContainer}>
          <Text style={styles.text}>Type</Text>
          <DropDownPicker
            style={[styles.picker, !openPickers.type && { zIndex: -1 }]}
            data={["all", "movie", "multi-episode"]}
            name="type"
            togglePickersExcept={togglePickersExcept}
            setPickerValues={setSearchInputs}
            pickerValues={searchInputs}
            open={openPickers.type}
            hideIcons
          />
        </View>
      </View>
    </View>
  );
};
export default SearchContianer;

const styles = StyleSheet.create({
  container: { marginTop: 10, marginBottom: 15 },
  upperContainer: {
    height: 50,
    flexDirection: "row",
    columnGap: 4,
    borderColor: globalColors.textMain,
  },
  textInput: {
    backgroundColor: globalColors.inputBackground,
    color: globalColors.textMain,
    fontSize: 20,
    height: "100%",
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  textInputContainer: {
    flex: 2,
  },
  pickersContainer: {
    flexDirection: "row",
    columnGap: 4,
    height: 55,
    marginBottom: 10,
    zIndex: -2,
  },
  pickerContainer: {
    flex: 1,
    marginTop: 10,
  },
  picker: {
    flex: 1,
  },
  text: {
    color: globalColors.textMain,
    fontSize: 16,
    marginBottom: 2,
    textAlign: "center",
    display: "none",
  },
  sortPickerContainer: {
    flex: 1,
    marginTop: 0,
  },
  sortPicker: { height: 50 },
});
