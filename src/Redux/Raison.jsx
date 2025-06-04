/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { lien } from "static/Lien";

const initialState = {
  feedback: [],
  readRaison: "",
  readRaisonError: "",
};
export const ReadRaison = createAsyncThunk("feedback/ReadRaison", async () => {
  try {
    const response = await axios.get(lien + "/readfeedback/all");
    return response.data;
  } catch (error) {
    if (error) {
      console.log("Error");
    }
  }
});

const demande = createSlice({
  name: "feedback",
  initialState,
  reducers: {},
  extraReducers: {
    [ReadRaison.pending]: (state, action) => {
      return {
        ...state,
        readRaison: "pending",
        readRaisonError: "",
      };
    },
    [ReadRaison.fulfilled]: (state, action) => {
      return {
        ...state,
        feedback: action.payload,
        readRaison: "success",
        readRaisonError: "",
      };
    },
    [ReadRaison.rejected]: (state, action) => {
      return {
        ...state,
        readRaison: "rejected",
        readRaisonError: action.payload,
      };
    },
  },
});

export default demande.reducer;
