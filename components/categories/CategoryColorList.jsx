import { View, StyleSheet, Pressable } from "react-native";
import { constantColors, globalColors } from "../../constants/styles";
import { Dimensions } from "react-native";
import { useLayoutEffect, useState } from "react";

const CategoryColorList = ({ onPickColor, style, padding, initialColor }) => {
  const [selectedColor, setSelectedColor] = useState();

  useLayoutEffect(() => {
    setSelectedColor(
      constantColors.findIndex((color) => color == initialColor)
    );
  }, [initialColor]);

  return (
    <View style={[styles.colorOuterContainer, style]}>
      {constantColors.map((color, index) => {
        return (
          <View
            key={index}
            style={[
              styles.colorInnerContainer,
              padding && {
                width: (Dimensions.get("window").width - padding * 2) / 4,
              },
            ]}
          >
            <Pressable
              style={[
                styles.colorView,
                { backgroundColor: color },
                selectedColor == index && styles.selectedColor,
              ]}
              onPress={() => {
                setSelectedColor(index);
                onPickColor(color);
              }}
            />
          </View>
        );
      })}
    </View>
  );
};

export default CategoryColorList;

const styles = StyleSheet.create({
  colorOuterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    flexWrap: "wrap",
    rowGap: 10,
  },

  colorInnerContainer: {
    width: Dimensions.get("window").width / 4,
    justifyContent: "center",
    alignItems: "center",
  },

  colorView: {
    height: Dimensions.get("window").width / 8,
    width: Dimensions.get("window").width / 8,
    borderRadius: Dimensions.get("window").width / 16,
  },

  selectedColor: {
    borderColor: globalColors.categoryColorContainerBorder,
    borderWidth: 3.5,
  },
});
