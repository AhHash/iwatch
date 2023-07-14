import { createSlice } from "@reduxjs/toolkit";
import {
  getAllCommitments,
  addCommitment,
  getCommitment,
  updateCommitment,
  deleteCommitment,
} from "./commitmentsThunk";

const initialState = {
  commitments: [],
  error: false,
  errorMessage: "",
  message: "",
  isEditing: false,
  selectedCommitment: {},
};

export const commitmentsSlice = createSlice({
  name: "commitments",
  initialState,
  reducers: {
    setIsEditing: (state, { payload }) => {
      state.isEditing = payload;
    },
    selectCommitment: (state, { payload }) => {
      state.selectedCommitment = state.commitments.find(
        (commitment) => commitment.id == payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCommitments.pending, (state) => {
        state.error = false;
        state.errorMessage = "";
        state.message = "";
      })
      .addCase(getAllCommitments.fulfilled, (state, { payload }) => {
        state.commitments = payload;
      })
      .addCase(getAllCommitments.rejected, (state, { error: { message } }) => {
        state.error = true;
        state.errorMessage = "Cannot fetch commitments";
      })
      .addCase(addCommitment.fulfilled, (state) => {
        state.message = "Commitment added successfully";
      })
      .addCase(addCommitment.rejected, (state, { error: { message } }) => {
        state.error = true;
        state.errorMessage = "Cannot add commitment";
      })
      // .addCase(getCommitment.fulfilled, (state) => {
      //   state.message = "Commitment fetched successfully";
      // })
      // .addCase(getCommitment.rejected, (state, { error: { message } }) => {
      //   state.error = true;
      //   state.errorMessage = "Cannot fetch commitment";
      // })
      .addCase(updateCommitment.fulfilled, (state) => {
        state.message = "Commitment updated successfully";
      })
      .addCase(updateCommitment.rejected, (state, { error: { message } }) => {
        state.error = true;
        state.errorMessage = "Cannot update commitment";
      })
      .addCase(deleteCommitment.fulfilled, (state) => {
        state.message = "Commitment deleted successfully";
      })
      .addCase(deleteCommitment.rejected, (state, { error: { message } }) => {
        state.error = true;
        state.errorMessage = "Cannot delete commitment";
      });
  },
});

export const { setIsEditing, selectCommitment } = commitmentsSlice.actions;

export default commitmentsSlice.reducer;
