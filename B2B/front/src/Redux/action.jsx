/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { config, lien } from "../static/Lien";
const initialState = {
  action: undefined,
  readaction: "",
  readactionError: null,
};
// Async thunk to read action data
export const Readaction = createAsyncThunk(
  "action/Readaction",
  async (_id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${lien}/readOpenAction`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Create a slice of the store for action
const actionSlice = createSlice({
  name: "action",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(Readaction.pending, (state) => {
        state.readaction = "pending";
        state.readactionError = null;
      })
      .addCase(Readaction.fulfilled, (state, action) => {
        state.action = action.payload;
        state.readaction = "";
        state.readactionError = null;
      })
      .addCase(Readaction.rejected, (state, action) => {
        state.readaction = "rejected";
        state.readactionError = action.payload;
      });
  },
});

export default actionSlice.reducer;
