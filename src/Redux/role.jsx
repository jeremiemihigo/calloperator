/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { config, lien_dt } from "static/Lien";

const initialState = {
  role: [],
  getrole: "",
  getroleError: "",
  postrole: "",
  postroleError: "",
  edit: "",
  editError: "",
};
export const Readrole = createAsyncThunk("role/Readrole", async () => {
  try {
    const response = await axios.get(lien_dt + "/role", config);
    return response.data;
  } catch (error) {
    if (error) {
      console.log("Error");
    }
  }
});
export const Postrole = createAsyncThunk(
  "role/Postrole",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(lien_dt + "/role", data, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const EditRole = createAsyncThunk(
  "role/EditRole",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put(lien_dt + "/editrole", data, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const role = createSlice({
  name: "role",
  initialState,
  reducers: {},
  extraReducers: {
    [Readrole.pending]: (state, action) => {
      return {
        ...state,
        getrole: "pending",
        getroleError: "",
        postrole: "",
        postroleError: "",
        edit: "",
        editError: "",
      };
    },
    [Readrole.fulfilled]: (state, action) => {
      return {
        role: action.payload,
        getrole: "success",
        getroleError: "",
        postrole: "",
        postroleError: "",
        edit: "",
        editError: "",
      };
    },
    [Readrole.rejected]: (state, action) => {
      return {
        ...state,
        getrole: "rejected",
        getroleError: action.payload,
        postrole: "",
        postroleError: "",
        edit: "",
        editError: "",
      };
    },
    [Postrole.pending]: (state, action) => {
      return {
        ...state,
        getrole: "",
        getroleError: "",
        postrole: "pending",
        postroleError: "",
        edit: "",
        editError: "",
      };
    },
    [Postrole.fulfilled]: (state, action) => {
      return {
        role: [action.payload, ...state.role],
        getrole: "success",
        getroleError: "",
        postrole: "",
        postroleError: "",
        edit: "",
        editError: "",
      };
    },
    [Postrole.rejected]: (state, action) => {
      return {
        ...state,
        getrole: "",
        getroleError: "",
        postrole: "rejected",
        postroleError: action.payload,
        edit: "",
        editError: "",
      };
    },
    [EditRole.pending]: (state, action) => {
      return {
        ...state,
        getrole: "",
        getroleError: "",
        postrole: "",
        postroleError: "",
        edit: "pending",
        editError: "",
      };
    },
    [EditRole.fulfilled]: (state, action) => {
      let new_role = state.role.map((x) =>
        x._id === action.payload._id ? action.payload : x
      );
      return {
        role: new_role,
        getrole: "",
        getroleError: "",
        postrole: "",
        postroleError: "",
        edit: "success",
        editError: "",
      };
    },
    [EditRole.rejected]: (state, action) => {
      return {
        ...state,
        getrole: "",
        getroleError: "",
        postrole: "",
        postroleError: "",
        edit: "rejected",
        editError: action.payload,
      };
    },
  },
});

export default role.reducer;
