/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { config, lien } from "../static/Lien";
const initialState = {
  projet: undefined,
  readprojet: "",
  readprojetError: null,
  saveprojet: "",
  saveprojetError: null,
  addaction: "",
  addactionError: null,
  comment: "",
  commentError: null,
};

// Async thunk to read projet data
export const Readprojets = createAsyncThunk(
  "projet/Readprojets",
  async (_id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${lien}/readProjet/all`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
export const Addprojet = createAsyncThunk(
  "projet/Addprojet",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${lien}/addprojet`, data, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
export const AddAction = createAsyncThunk(
  "projet/AddAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${lien}/addaction`, data, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
export const AddCommentaire = createAsyncThunk(
  "projet/AddCommentaire",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${lien}/changestatus`, data, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Create a slice of the store for projet
const projetSlice = createSlice({
  name: "projet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(Readprojets.pending, (state) => {
        state.readprojet = "pending";
        state.readprojetError = null;
        state.saveprojet = "";
        state.saveprojetError = "";
        state.addaction = "";
        state.addactionError = "";
        state.comment = "";
        state.commentError = null;
      })
      .addCase(Readprojets.fulfilled, (state, action) => {
        state.projet = action.payload;
        state.readprojet = "";
        state.readprojetError = null;
        state.saveprojet = "";
        state.saveprojetError = "";
        state.addaction = "";
        state.addactionError = "";
        state.comment = "";
        state.commentError = null;
      })
      .addCase(Readprojets.rejected, (state, action) => {
        state.readprojet = "rejected";
        state.readprojetError = action.payload;
        state.saveprojet = "";
        state.saveprojetError = "";
        state.addaction = "";
        state.addactionError = "";
        state.comment = "";
        state.commentError = null;
      })
      .addCase(Addprojet.pending, (state) => {
        state.saveprojet = "pending";
        state.saveprojetError = null;
        state.addaction = "";
        state.addactionError = "";
        state.comment = "";
        state.commentError = null;
      })
      .addCase(Addprojet.fulfilled, (state, action) => {
        state.projet = [action.payload, ...state.projet];
        state.saveprojet = "success";
        state.saveprojetError = null;
        state.addaction = "";
        state.addactionError = "";
        state.comment = "";
        state.commentError = null;
      })
      .addCase(Addprojet.rejected, (state, action) => {
        state.saveprojet = "rejected";
        state.saveprojetError = action.payload;
        state.addaction = "";
        state.addactionError = "";
        state.comment = "";
        state.commentError = null;
      })
      .addCase(AddAction.pending, (state) => {
        state.saveprojet = "";
        state.saveprojetError = "";
        state.addaction = "pending";
        state.addactionError = null;
        state.comment = "";
        state.commentError = null;
      })
      .addCase(AddAction.fulfilled, (state, action) => {
        let filtre = state.projet.map((x) =>
          x.id === action.payload.id ? action.payload : x
        );
        state.projet = filtre;
        state.saveprojet = "";
        state.saveprojetError = "";
        state.addaction = "success";
        state.addactionError = null;
        state.comment = "";
        state.commentError = null;
      })
      .addCase(AddAction.rejected, (state, action) => {
        state.saveprojet = "";
        state.saveprojetError = "";
        state.addaction = "rejected";
        state.addactionError = action.payload;
        state.comment = "";
        state.commentError = null;
      })
      .addCase(AddCommentaire.pending, (state) => {
        state.saveprojet = "";
        state.saveprojetError = "";
        state.addaction = "";
        state.addactionError = null;
        state.comment = "pending";
        state.commentError = null;
      })
      .addCase(AddCommentaire.fulfilled, (state, action) => {
        let filtre = state.projet.map((x) =>
          x.id === action.payload.id ? action.payload : x
        );
        state.projet = filtre;
        state.saveprojet = "";
        state.saveprojetError = "";
        state.addaction = "";
        state.addactionError = null;
        state.comment = "success";
        state.commentError = null;
      })
      .addCase(AddCommentaire.rejected, (state, action) => {
        state.saveprojet = "";
        state.saveprojetError = "";
        state.addaction = "";
        state.addactionError = null;
        state.comment = "rejected";
        state.commentError = action.payload;
      });
  },
});

export default projetSlice.reducer;
