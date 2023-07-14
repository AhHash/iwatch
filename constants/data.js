import { colors } from "./styles";
import Category from "../models/Category";

export const baseCategories = [
  new Category(
    "アニメ",
    colors.anime,
    require("../assets/categories/anime.jpg")
  ),
  new Category(
    "K-Drama",
    colors.kDrama,
    require("../assets/categories/kDrama.jpg")
  ),
  new Category("TV", colors.tv, require("../assets/categories/tv.jpg")),
];

export const placeholderImages = {
  commitment: require("../assets/placeholders/commitment.jpg"),
};
