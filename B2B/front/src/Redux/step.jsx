/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { config, lien } from "../static/Lien";
const initialState = {
  step: undefined,
  readstep: "",
  savestep: "",
  savestepError: "",
  readstepError: null,
};

// Async thunk to read step data
export const Readsteps = createAsyncThunk(
  "step/Readsteps",
  async (_id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${lien}/alletape`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
export const Addstep = createAsyncThunk(
  "step/Addstep",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${lien}/etape`, data, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Create a slice of the store for step
const stepSlice = createSlice({
  name: "step",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(Readsteps.pending, (state) => {
        state.readstep = "pending";
        state.readstepError = null;
      })
      .addCase(Readsteps.fulfilled, (state, action) => {
        state.step = action.payload;
        state.readstep = "";
        state.readstepError = null;
      })
      .addCase(Readsteps.rejected, (state, action) => {
        state.readstep = "rejected";
        state.readstepError = action.payload;
      })
      .addCase(Addstep.pending, (state) => {
        state.savestep = "pending";
        state.savestepError = null;
      })
      .addCase(Addstep.fulfilled, (state, action) => {
        state.step = [action.payload, ...state.step];
        state.savestep = "success";
        state.savestepError = null;
      })
      .addCase(Addstep.rejected, (state, action) => {
        state.savestep = "rejected";
        state.savestepError = action.payload;
      });
  },
});

export default stepSlice.reducer;
