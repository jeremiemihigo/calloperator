/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useNavigate } from "react-router";
import { config, lien } from "../static/Lien";
const initialState = {
  categorie: undefined,
  readcategorie: "",
  readcategorieError: null,
  savecategorie: "",
  savecategorieError: null,
  editcategorie: "",
  editcategorieError: null,
  deletecategorie: "",
  deletecategorieError: null,
};

// Async thunk to read categorie data

export const Readcategories = createAsyncThunk(
  "categorie/Readcategories",
  async (_id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${lien}/readCategorisation`, config);
      if (response.data === "token_expired") {
        const navigate = useNavigate();
        localStorage.removeItem("auth");
        navigate("/auth/login");
      }
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
export const DeleteCategorie = createAsyncThunk(
  "categorie/DeleteCategorie",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${lien}/deleteCategorisation`,
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
        state.deletecategorie = "";
        state.deletecategorieError = null;
      })
      .addCase(Readcategories.fulfilled, (state, action) => {
        state.categorie = action.payload;
        state.readcategorie = "success";
        state.readcategorieError = null;
        state.savecategorie = "";
        state.savecategorieError = null;
        state.editcategorie = "";
        state.editcategorieError = null;
        state.deletecategorie = "";
        state.deletecategorieError = null;
      })
      .addCase(Readcategories.rejected, (state, action) => {
        state.readcategorie = "rejected";
        state.readcategorieError = action.payload;
        state.savecategorie = "";
        state.savecategorieError = null;
        state.editcategorie = "";
        state.editcategorieError = null;
        state.deletecategorie = "";
        state.deletecategorieError = null;
      })
      .addCase(Addcategorie.pending, (state) => {
        state.readcategorie = "";
        state.readcategorieError = null;
        state.savecategorie = "pending";
        state.savecategorieError = null;
        state.editcategorie = "";
        state.editcategorieError = null;
        state.deletecategorie = "";
        state.deletecategorieError = null;
      })
      .addCase(Addcategorie.fulfilled, (state, action) => {
        state.categorie = [action.payload, ...state.categorie];
        state.readcategorie = "";
        state.readcategorieError = null;
        state.savecategorie = "success";
        state.savecategorieError = null;
        state.editcategorie = "";
        state.editcategorieError = null;
        state.deletecategorie = "";
        state.deletecategorieError = null;
      })
      .addCase(Addcategorie.rejected, (state, action) => {
        state.readcategorie = "";
        state.readcategorieError = null;
        state.savecategorie = "rejected";
        state.savecategorieError = action.payload;
        state.editcategorie = "";
        state.editcategorieError = null;
        state.deletecategorie = "";
        state.deletecategorieError = null;
      })
      .addCase(ModifierCategorie.pending, (state) => {
        state.readcategorie = "";
        state.readcategorieError = null;
        state.savecategorie = "";
        state.savecategorieError = null;
        state.editcategorie = "pending";
        state.editcategorieError = null;
        state.deletecategorie = "";
        state.deletecategorieError = null;
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
        state.deletecategorie = "";
        state.deletecategorieError = null;
      })
      .addCase(ModifierCategorie.rejected, (state, action) => {
        state.readcategorie = "";
        state.readcategorieError = null;
        state.savecategorie = "";
        state.savecategorieError = null;
        state.editcategorie = "rejected";
        state.editcategorieError = action.payload;
        state.deletecategorie = "";
        state.deletecategorieError = null;
      })
      .addCase(DeleteCategorie.pending, (state) => {
        state.readcategorie = "";
        state.readcategorieError = null;
        state.savecategorie = "";
        state.savecategorieError = null;
        state.editcategorie = "";
        state.editcategorieError = null;
        state.deletecategorie = "pending";
        state.deletecategorieError = null;
      })
      .addCase(DeleteCategorie.fulfilled, (state, action) => {
        let filtre = state.categorie.filter((x) => x.id !== action.payload);
        state.categorie = filtre;
        state.readcategorie = "";
        state.readcategorieError = null;
        state.savecategorie = "";
        state.savecategorieError = null;
        state.editcategorie = "";
        state.editcategorieError = null;
        state.deletecategorie = "success";
        state.deletecategorieError = null;
      })
      .addCase(DeleteCategorie.rejected, (state, action) => {
        state.readcategorie = "";
        state.readcategorieError = null;
        state.savecategorie = "";
        state.savecategorieError = null;
        state.editcategorie = "";
        state.editcategorieError = null;
        state.deletecategorie = "rejected";
        state.deletecategorieError = action.payload;
      });
  },
});

export default categorieSlice.reducer;
