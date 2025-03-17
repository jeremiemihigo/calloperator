/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { config, lien } from "static/Lien";

const initialState = {
  user: [],
  readUser: "",
  readUserError: "",
};
export const ReadUser = createAsyncThunk("user/ReadUser", async () => {
  try {
    const response = await axios.get(lien + "/userAdmin", config);
    return response.data;
  } catch (error) {
    if (error) {
      console.log("Error");
    }
  }
});

const user = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: {
    [ReadUser.pending]: (state, action) => {
      return {
        ...state,
        readUser: "pending",
        readUserError: "",
      };
    },
    [ReadUser.fulfilled]: (state, action) => {
      return {
        user: action.payload,
        readUser: "success",
        readUserError: "",
      };
    },
    [ReadUser.rejected]: (state, action) => {
      return {
        ...state,
        readUser: "rejected",
        readUserError: action.payload,
      };
    },
  },
});

export default user.reducer;
