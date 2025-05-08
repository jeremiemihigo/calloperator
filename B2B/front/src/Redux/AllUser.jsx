/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { config, lien } from "../static/Lien";
const initialState = {
  user: undefined,
  readuser: "",
  saveuser: "",
  saveuserError: "",
  readuserError: null,
};

// Async thunk to read user data
export const Readusers = createAsyncThunk(
  "user/Readusers",
  async (_id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${lien}/readAllUser`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
export const Adduser = createAsyncThunk(
  "user/Adduser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${lien}/addUser`, data, config);
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
      .addCase(Readusers.pending, (state) => {
        state.readuser = "pending";
        state.readuserError = null;
      })
      .addCase(Readusers.fulfilled, (state, action) => {
        state.user = action.payload;
        state.readuser = "";
        state.readuserError = null;
      })
      .addCase(Readusers.rejected, (state, action) => {
        state.readuser = "rejected";
        state.readuserError = action.payload;
      })
      .addCase(Adduser.pending, (state) => {
        state.saveuser = "pending";
        state.saveuserError = null;
      })
      .addCase(Adduser.fulfilled, (state, action) => {
        state.user = [action.payload, ...state.user];
        state.saveuser = "success";
        state.saveuserError = null;
      })
      .addCase(Adduser.rejected, (state, action) => {
        state.saveuser = "rejected";
        state.saveuserError = action.payload;
      });
  },
});

export default userSlice.reducer;
