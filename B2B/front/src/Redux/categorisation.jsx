/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { config, lien } from "../static/Lien";
const initialState = {
  categorie: undefined,
  readcategorie: "",
  readcategorieError: null,
  savecategorie: "",
  savecategorieError: null,
  editcategorie: "",
  editcategorieError: null,
};

// Async thunk to read categorie data
export const Readcategories = createAsyncThunk(
  "categorie/Readcategories",
  async (_id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${lien}/readCategorisation`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
export const Addcategorie = createAsyncThunk(
  "categorie/Addcategorie",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${lien}/addCategorisation`,
        data,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
export const ModifierCategorie = createAsyncThunk(
  "categorie/ModifierCategorie",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${lien}/editCategorisation`,
        data,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Create a slice of the store for categorie
const categorieSlice = createSlice({
  name: "categorie",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(Readcategories.pending, (state) => {
        state.readcategorie = "";
        state.readcategorieError = null;
        state.savecategorie = "";
        state.savecategorieError = null;
        state.editcategorie = "";
        state.editcategorieError = null;
      })
      .addCase(Readcategories.fulfilled, (state, action) => {
        state.categorie = action.payload;
        state.readcategorie = "success";
        state.readcategorieError = null;
        state.savecategorie = "";
        state.savecategorieError = null;
        state.editcategorie = "";
        state.editcategorieError = null;
      })
      .addCase(Readcategories.rejected, (state, action) => {
        state.readcategorie = "rejected";
        state.readcategorieError = action.payload;
        state.savecategorie = "";
        state.savecategorieError = null;
        state.editcategorie = "";
        state.editcategorieError = null;
      })
      .addCase(Addcategorie.pending, (state) => {
        state.readcategorie = "";
        state.readcategorieError = null;
        state.savecategorie = "pending";
        state.savecategorieError = null;
        state.editcategorie = "";
        state.editcategorieError = null;
      })
      .addCase(Addcategorie.fulfilled, (state, action) => {
        state.categorie = [action.payload, ...state.categorie];
        state.readcategorie = "";
        state.readcategorieError = null;
        state.savecategorie = "success";
        state.savecategorieError = null;
        state.editcategorie = "";
        state.editcategorieError = null;
      })
      .addCase(Addcategorie.rejected, (state, action) => {
        state.readcategorie = "";
        state.readcategorieError = null;
        state.savecategorie = "rejected";
        state.savecategorieError = action.payload;
        state.editcategorie = "";
        state.editcategorieError = null;
      })
      .addCase(ModifierCategorie.pending, (state) => {
        state.readcategorie = "";
        state.readcategorieError = null;
        state.savecategorie = "";
        state.savecategorieError = null;
        state.editcategorie = "pending";
        state.editcategorieError = null;
      })
      .addCase(ModifierCategorie.fulfilled, (state, action) => {
        let filtre = state.categorie.map((x) =>
          x.id === action.payload.id ? action.payload : x
        );
        state.categorie = filtre;
        state.readcategorie = "";
        state.readcategorieError = null;
        state.savecategorie = "";
        state.savecategorieError = null;
        state.editcategorie = "success";
        state.editcategorieError = null;
      })
      .addCase(ModifierCategorie.rejected, (state, action) => {
        state.readcategorie = "";
        state.readcategorieError = null;
        state.savecategorie = "";
        state.savecategorieError = null;
        state.editcategorie = "rejected";
        state.editcategorieError = action.payload;
      });
  },
});

export default categorieSlice.reducer;
