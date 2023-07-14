import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useLayoutEffect, useState } from "react";
import { ImageBackground, Text, View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import CommitmentsList from "../components/commitments/CommitmentsList";
import HeaderSortButton from "../components/categories/HeaderSortButton";

const CategoryScreen = () => {
  const {
    params: { id },
  } = useRoute();
  const { setOptions } = useNavigation();

  const categories = useSelector((store) => store.categories.categories);
  const commitments = useSelector((store) => store.commitments.commitments);

  const currentCategory = categories.find((category) => category.id == id);
  const currentCommitments = commitments.filter(
    (commitment) => commitment.category == currentCategory.id
  );

  const [sort, setSort] = useState("recent");

  useLayoutEffect(() => {
    setOptions({
      headerRight: () => {
        return <HeaderSortButton onValueChange={setSort} />;
      },
      headerTitle: currentCategory.name,
    });
  }, []);

  useLayoutEffect(() => {}, []);
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <ImageBackground
          source={
            typeof currentCategory.img == "number"
              ? currentCategory.img
              : { uri: currentCategory.img }
          }
          style={styles.categoryImage}
        >
          <LinearGradient
            colors={["rgba(0, 0, 0, 0.2)", "rgba(0, 0, 0, 0.9)"]}
            style={styles.cateogryGradient}
          >
            <Text style={styles.categoryText}>{currentCategory.name}</Text>
          </LinearGradient>
        </ImageBackground>
      </View>
      <View style={styles.commitmentsContainer}>
        <CommitmentsList
          sort={sort}
          data={currentCommitments}
          showAddOnEmpty
          redirectData={{ category: currentCategory.id }}
        />
      </View>
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    width: "100%",
    height: 180,
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
    fontSize: 42,
  },
  editText: {
    backgroundColor: "rgba(75, 75, 75, 1)",
    textAlign: "center",
    fontSize: 28,
    opacity: 0.3,
    fontWeight: "bold",
    color: "white",
  },
  commitmentsContainer: {
    flex: 1,
    padding: 10,
    marginBottom: "10%",
  },
});
