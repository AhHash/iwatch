import { createSlice } from "@reduxjs/toolkit";
import {
  getAllCategories,
  addCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} from "./categoriesthunk";

const initialState = {
  categories: [],
  error: false,
  errorMessage: "",
  message: "",
  isEditing: false,
  selectedCategory: {},
};

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setIsEditing: (state, { payload }) => {
      state.isEditing = payload;
    },
    selectCategory: (state, { payload }) => {
      state.selectedCategory = state.categories.find(
        (category) => category.id == payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategories.pending, (state) => {
        state.error = false;
        state.errorMessage = "";
        state.message = "";
        state.editCategory = {};
      })
      .addCase(getAllCategories.fulfilled, (state, { payload }) => {
        state.categories = payload;
      })
      .addCase(getAllCategories.rejected, (state, { error: { message } }) => {
        state.error = true;
        state.errorMessage = "Cannot fetch categories";
      })
      .addCase(addCategory.fulfilled, (state) => {
        state.message = "Category added successfully";
      })
      .addCase(addCategory.rejected, (state, { error: { message } }) => {
        state.error = true;
        state.errorMessage = "Cannot add category";
        console.log(message);
      })
      // .addCase(getCategory.fulfilled, (state, { payload }) => {
      //   state.editCategory = payload;
      //   state.message = "Category fetched successfully";
      // })
      // .addCase(getCategory.rejected, (state, { error: { message } }) => {
      //   state.error = true;
      //   state.errorMessage = "Cannot fetch category";
      // })
      .addCase(updateCategory.fulfilled, (state) => {
        state.message = "Category updated successfully";
      })
      .addCase(updateCategory.rejected, (state, { error: { message } }) => {
        state.error = true;
        state.errorMessage = "Cannot update category";
      })
      .addCase(deleteCategory.fulfilled, (state) => {
        state.message = "Category deleted successfully";
      })
      .addCase(deleteCategory.rejected, (state, { error: { message } }) => {
        state.error = true;
        state.errorMessage = "Cannot delete category";
      });
  },
});

export default categoriesSlice.reducer;

export const { setIsEditing, selectCategory } = categoriesSlice.actions;
