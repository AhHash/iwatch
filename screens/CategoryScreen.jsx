import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useLayoutEffect, useMemo, useState } from "react";
import { ImageBackground, Text, View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import CommitmentsList from "../components/commitments/CommitmentsList";
import HeaderSortButton from "../components/categories/HeaderSortButton";
import { getImgUri } from "../util/format";
import { globalColors } from "../constants/styles";

const CategoryScreen = ({
  route: {
    params: { id },
  },
  navigation: { setOptions },
}) => {
  const isFocused = useIsFocused();

  const categories = useSelector((store) => store.categories.categories);
  const commitments = useSelector((store) => store.commitments.commitments);

  const [sort, setSort] = useState("recent");

  const selectedCategory = useMemo(() => {
    return categories.find((category) => category.id == id);
  }, [id]);
  const currentCommitments = useMemo(() => {
    return commitments.filter(
      (commitment) => commitment.category == selectedCategory.id
    );
  }, [commitments, isFocused]);

  useLayoutEffect(() => {
    setOptions({
      headerRight: () => {
        return <HeaderSortButton onValueChange={setSort} />;
      },
      headerTitle: selectedCategory.name,
    });
  }, [selectedCategory]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <ImageBackground
          source={getImgUri(selectedCategory.img)}
          style={styles.categoryImage}
        >
          <LinearGradient
            colors={["rgba(0, 0, 0, 0.2)", "rgba(0, 0, 0, 0.9)"]}
            style={styles.cateogryGradient}
          >
            <Text style={styles.categoryText}>{selectedCategory.name}</Text>
          </LinearGradient>
        </ImageBackground>
      </View>
      <View style={styles.commitmentsContainer}>
        <CommitmentsList
          sort={sort}
          data={currentCommitments}
          showAddOnEmpty
          redirectData={{ category: selectedCategory.id }}
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
    color: globalColors.textMain,
    marginVertical: 15,
    marginHorizontal: 10,
    fontWeight: "bold",
    fontSize: 42,
  },
  editText: {
    backgroundColor: globalColors.textBackground,
    textAlign: "center",
    fontSize: 28,
    opacity: 0.3,
    fontWeight: "bold",
    color: globalColors.textMain,
  },
  commitmentsContainer: {
    flex: 1,
    padding: 10,
    marginBottom: "10%",
  },
});
