/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { config, lien_issue } from "static/Lien";

const initialState = {
  delai: [],
  adddelai: "",
  adddelaiError: "",
  readdelai: "",
  readdelaiError: "",
};
export const Readdelai = createAsyncThunk("delai/Readdelai", async () => {
  try {
    const response = await axios.get(lien_issue + "/delai", config);
    return response.data;
  } catch (error) {
    if (error) {
      console.log("Error");
    }
  }
});
export const Ajouterdelai = createAsyncThunk(
  "delai/Ajouterdelai",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(lien_issue + "/delai", data, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const delai = createSlice({
  name: "delai",
  initialState,
  reducers: {},
  extraReducers: {
    [Readdelai.pending]: (state, action) => {
      return {
        ...state,
        adddelai: "",
        adddelaiError: "",
        readdelai: "",
        readdelaiError: "",
      };
    },
    [Readdelai.fulfilled]: (state, action) => {
      return {
        delai: action.payload,
        adddelai: "",
        adddelaiError: "",
        readdelai: "success",
        readdelaiError: "",
      };
    },
    [Readdelai.rejected]: (state, action) => {
      return {
        ...state,
        adddelai: "",
        adddelaiError: "",
        readdelai: "rejected",
        readdelaiError: action.payload,
      };
    },
    [Ajouterdelai.pending]: (state, action) => {
      return {
        ...state,
        adddelai: "pending",
        adddelaiError: "",
        readdelai: "",
        readdelaiError: "",
      };
    },
    [Ajouterdelai.fulfilled]: (state, action) => {
      return {
        delai: [action.payload, ...state.delai],
        adddelai: "success",
        adddelaiError: "",
        readdelai: "",
        readdelaiError: "",
      };
    },
    [Ajouterdelai.rejected]: (state, action) => {
      return {
        ...state,
        adddelai: "rejected",
        adddelaiError: action.payload,
        readdelai: "",
        readdelaiError: "",
      };
    },
  },
});

export default delai.reducer;
