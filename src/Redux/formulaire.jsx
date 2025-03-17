/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { config, portofolio } from "static/Lien";

const initialState = {
  formulaire: [],
  addformulaire: "",
  addformulaireError: "",
  readformulaire: "",
  readformulaireError: "",
};
export const ReadFormulaire = createAsyncThunk(
  "formulaire/ReadFormulaire",
  async () => {
    try {
      const response = await axios.get(portofolio + "/readFormulaire", config);
      return response.data;
    } catch (error) {
      if (error) {
        console.log("Error");
      }
    }
  }
);
export const AjouterFormulaire = createAsyncThunk(
  "formulaire/AjouterFormulaire",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        portofolio + "/addFormulaire",
        data,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const formulaire = createSlice({
  name: "formulaire",
  initialState,
  reducers: {},
  extraReducers: {
    [ReadFormulaire.pending]: (state, action) => {
      return {
        ...state,
        addformulaire: "",
        addformulaireError: "",
        readformulaire: "pending",
        readformulaireError: "",
      };
    },
    [ReadFormulaire.fulfilled]: (state, action) => {
      return {
        formulaire: action.payload,
        addformulaire: "",
        addformulaireError: "",
        readformulaire: "success",
        readformulaireError: "",
      };
    },
    [ReadFormulaire.rejected]: (state, action) => {
      return {
        ...state,
        addformulaire: "",
        addformulaireError: "",
        readformulaire: "rejected",
        readformulaireError: action.payload,
      };
    },
    [AjouterFormulaire.pending]: (state, action) => {
      return {
        ...state,
        addformulaire: "pending",
        addformulaireError: "",
        readformulaire: "",
        readformulaireError: "",
      };
    },
    [AjouterFormulaire.fulfilled]: (state, action) => {
      return {
        formulaire: [action.payload, ...state.formulaire],
        addformulaire: "success",
        addformulaireError: "",
        readformulaire: "",
        readformulaireError: "",
      };
    },
    [AjouterFormulaire.rejected]: (state, action) => {
      return {
        ...state,
        addformulaire: "rejected",
        addformulaireError: action.payload,
        readformulaire: "",
        readformulaireError: "",
      };
    },
  },
});

export default formulaire.reducer;
