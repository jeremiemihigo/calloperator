/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { config, lien } from "../static/Lien";
const initialState = {
  prospect: undefined,
  readprospect: "",
  readprospectError: null,
  saveprospect: "",
  saveprospectError: null,
  addaction: "",
  addactionError: null,
  comment: "",
  commentError: null,
};

// Async thunk to read prospect data
export const Readprospects = createAsyncThunk(
  "prospect/Readprospects",
  async (_id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${lien}/readprospect/all`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
export const Addprospect = createAsyncThunk(
  "prospect/Addprospect",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${lien}/addprospect`, data, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
export const AddActionProspect = createAsyncThunk(
  "prospect/AddActionProspect",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${lien}/addaction`, data, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
export const changeStatusProspect = createAsyncThunk(
  "prospect/changeStatusProspect",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${lien}/changeStatusProspect`,
        data,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Create a slice of the store for prospect
const prospectSlice = createSlice({
  name: "prospect",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(Readprospects.pending, (state) => {
        state.readprospect = "pending";
        state.readprospectError = null;
        state.saveprospect = "";
        state.saveprospectError = "";
        state.addaction = "";
        state.addactionError = "";
        state.comment = "";
        state.commentError = null;
      })
      .addCase(Readprospects.fulfilled, (state, action) => {
        state.prospect = action.payload;
        state.readprospect = "";
        state.readprospectError = null;
        state.saveprospect = "";
        state.saveprospectError = "";
        state.addaction = "";
        state.addactionError = "";
        state.comment = "";
        state.commentError = null;
      })
      .addCase(Readprospects.rejected, (state, action) => {
        state.readprospect = "rejected";
        state.readprospectError = action.payload;
        state.saveprospect = "";
        state.saveprospectError = "";
        state.addaction = "";
        state.addactionError = "";
        state.comment = "";
        state.commentError = null;
      })
      .addCase(Addprospect.pending, (state) => {
        state.saveprospect = "pending";
        state.saveprospectError = null;
        state.addaction = "";
        state.addactionError = "";
        state.comment = "";
        state.commentError = null;
      })
      .addCase(Addprospect.fulfilled, (state, action) => {
        state.prospect = [action.payload, ...state.prospect];
        state.saveprospect = "success";
        state.saveprospectError = null;
        state.addaction = "";
        state.addactionError = "";
        state.comment = "";
        state.commentError = null;
      })
      .addCase(Addprospect.rejected, (state, action) => {
        state.saveprospect = "rejected";
        state.saveprospectError = action.payload;
        state.addaction = "";
        state.addactionError = "";
        state.comment = "";
        state.commentError = null;
      })
      .addCase(AddActionProspect.pending, (state) => {
        state.saveprospect = "";
        state.saveprospectError = "";
        state.addaction = "pending";
        state.addactionError = null;
        state.comment = "";
        state.commentError = null;
      })
      .addCase(AddActionProspect.fulfilled, (state, action) => {
        let filtre = state.prospect.map((x) =>
          x.id === action.payload.id ? action.payload : x
        );
        state.prospect = filtre;
        state.saveprospect = "";
        state.saveprospectError = "";
        state.addaction = "success";
        state.addactionError = null;
        state.comment = "";
        state.commentError = null;
      })
      .addCase(AddActionProspect.rejected, (state, action) => {
        state.saveprospect = "";
        state.saveprospectError = "";
        state.addaction = "rejected";
        state.addactionError = action.payload;
        state.comment = "";
        state.commentError = null;
      })
      .addCase(changeStatusProspect.pending, (state) => {
        state.saveprospect = "";
        state.saveprospectError = "";
        state.addaction = "";
        state.addactionError = null;
        state.comment = "pending";
        state.commentError = null;
      })
      .addCase(changeStatusProspect.fulfilled, (state, action) => {
        let filtre = state.prospect.map((x) =>
          x.id === action.payload.id ? action.payload : x
        );
        state.prospect = filtre;
        state.saveprospect = "";
        state.saveprospectError = "";
        state.addaction = "";
        state.addactionError = null;
        state.comment = "success";
        state.commentError = null;
      })
      .addCase(changeStatusProspect.rejected, (state, action) => {
        state.saveprospect = "";
        state.saveprospectError = "";
        state.addaction = "";
        state.addactionError = null;
        state.comment = "rejected";
        state.commentError = action.payload;
      });
  },
});

export default prospectSlice.reducer;
