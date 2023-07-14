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

const CategoriesList = ({ data, style, fixed }) => {
  const { navigate } = useNavigation();
  const isEditing = useSelector((store) => store.categories.isEditing);

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={data}
      style={[{ borderRadius: 5, overflow: "hidden" }, style]}
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
              source={
                typeof item.img == "number" ? item.img : { uri: item.img }
              }
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
    color: "white",
    marginVertical: 15,
    marginHorizontal: 10,
    fontWeight: "bold",
    fontSize: 24,
  },
  editText: {
    backgroundColor: "rgba(75, 75, 75, 1)",
    textAlign: "center",
    fontSize: 28,
    opacity: 0.3,
    fontWeight: "bold",
    color: "white",
  },
});
