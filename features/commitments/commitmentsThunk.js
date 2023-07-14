import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAll, addOne, deleteOne, getOne, updateOne } from "../../db";

export const getAllCommitments = createAsyncThunk(
  "commitments/getAllCommitments",
  async () => {
    return await getAll("commitments");
  }
);

export const addCommitment = createAsyncThunk(
  "commitments/addCommitment",
  async (commitment, thunkAPI) => {
    await addOne(commitment);
    const action = await thunkAPI.dispatch(getAllCommitments());
    return action.payload;
  }
);

export const getCommitment = createAsyncThunk(
  "commitments/getCommitment",
  async (id) => {
    return await getOne("commitments", id);
  }
);

export const deleteCommitment = createAsyncThunk(
  "commitments/deleteCommitment",
  async (id, thunkAPI) => {
    await deleteOne("commitments", id);
    const action = await thunkAPI.dispatch(getAllCommitments());
    return action.payload;
  }
);

export const updateCommitment = createAsyncThunk(
  "commitments/updateCateogry",
  async (commitment, thunkAPI) => {
    const result = await updateOne(commitment);
    await thunkAPI.dispatch(getAllCommitments());
    return result;
  }
);
