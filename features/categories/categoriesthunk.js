import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAll, addOne, deleteOne, getOne, updateOne } from "../../db";

export const getAllCategories = createAsyncThunk(
  "categories/getAllCategories",
  async () => {
    return await getAll("categories");
  }
);

export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async (category, thunkAPI) => {
    await addOne(category);
    const action = await thunkAPI.dispatch(getAllCategories());
    return action.payload;
  }
);

export const getCategory = createAsyncThunk(
  "categories/getCategory",
  async (id) => {
    return await getOne("categories", id);
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id, thunkAPI) => {
    await deleteOne("categories", id);
    const action = await thunkAPI.dispatch(getAllCategories());
    return action.payload;
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCateogry",
  async (category, thunkAPI) => {
    const result = await updateOne(category);
    await thunkAPI.dispatch(getAllCategories());
    return result;
  }
);
