import {
  FlatList,
  ImageBackground,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

import { getImgUri } from "../../util/format";
import { globalColors } from "../../constants/styles";

const CategoriesList = ({ style, fixed, isEditing, data }) => {
  const { navigate } = useNavigation();
  const { categories } = useSelector((store) => store.categories);

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={data || categories}
      style={[styles.list, style]}
      bounces={!fixed}
      renderItem={({ item }) => {
        return (
          <Pressable
            style={styles.categoryContainer}
            onPress={() => {
              if (isEditing) {
                navigate("Manage", {
                  mode: "edit",
                  type: "category",
                  id: item.id,
                });
              } else {
                navigate("Category", { id: item.id });
              }
            }}
          >
            <ImageBackground
              source={getImgUri(item.img)}
              style={styles.categoryImage}
            >
              <LinearGradient
                colors={["rgba(0, 0, 0, 0.2)", "rgba(0, 0, 0, 0.7)"]}
                style={styles.cateogryGradient}
              >
                {isEditing && <Text style={styles.editText}>Tab To Edit</Text>}
                <Text style={styles.categoryText}>{item.name}</Text>
              </LinearGradient>
            </ImageBackground>
          </Pressable>
        );
      }}
    />
  );
};
export default CategoriesList;

const styles = StyleSheet.create({
  list: {
    borderRadius: 5,
    overflow: "hidden",
  },
  categoryContainer: {
    width: "100%",
    height: 130,
    position: "relative",
    borderRadius: 5,
    overflow: "hidden",
    marginVertical: 5,
  },
  categoryImage: {
    flex: 1,
  },
  cateogryGradient: {
    flex: 1,
  },
  categoryText: {
    position: "absolute",
    bottom: 0,
    left: 0,
    color: globalColors.textMain,
    marginVertical: 15,
    marginHorizontal: 10,
    fontWeight: "bold",
    fontSize: 24,
  },
  editText: {
    backgroundColor: globalColors.textBackground,
    textAlign: "center",
    fontSize: 28,
    opacity: 0.3,
    fontWeight: "bold",
    color: globalColors.textMain,
  },
});
