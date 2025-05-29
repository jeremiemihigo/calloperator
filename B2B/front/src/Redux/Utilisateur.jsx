/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { config, lien } from "../static/Lien";
const initialState = {
  user: undefined,
  readUser: "",
  readUserError: null,
};
// Async thunk to read user data
export const ReadUser = createAsyncThunk(
  "user/ReadUser",
  async (_id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${lien}/readUserConnect`, config);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Create a slice of the store for user
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ReadUser.pending, (state) => {
        state.readUser = "pending";
        state.readUserError = null;
      })
      .addCase(ReadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.readUser = "";
        state.readUserError = null;
      })
      .addCase(ReadUser.rejected, (state, action) => {
        state.readUser = "rejected";
        state.readUserError = action.payload;
      });
  },
});

export default userSlice.reducer;
