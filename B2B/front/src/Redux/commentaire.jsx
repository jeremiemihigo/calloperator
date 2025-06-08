/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { config, lien } from "../static/Lien";
const initialState = {
  commentaire: undefined,
  readcommentaire: "",
  readcommentaireError: null,
};
// Async thunk to read commentaire data
export const Readcommentaire = createAsyncThunk(
  "commentaire/Readcommentaire",
  async (_id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${lien}/readCommentaire`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Create a slice of the store for commentaire
const commentaireSlice = createSlice({
  name: "commentaire",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(Readcommentaire.pending, (state) => {
        state.readcommentaire = "pending";
        state.readcommentaireError = null;
      })
      .addCase(Readcommentaire.fulfilled, (state, action) => {
        state.commentaire = action.payload;
        state.readcommentaire = "";
        state.readcommentaireError = null;
      })
      .addCase(Readcommentaire.rejected, (state, action) => {
        state.readcommentaire = "rejected";
        state.readcommentaireError = action.payload;
      });
  },
});

export default commentaireSlice.reducer;
