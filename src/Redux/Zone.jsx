/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { config, lien } from "static/Lien";

const initialState = {
  zone: [],
  addZone: "",
  addZoneError: "",
  getZone: "",
  getZoneError: "",
};
export const ReadAllZone = createAsyncThunk("zone/ReadAllZone", async () => {
  try {
    const response = await axios.get(lien + "/zone", config);
    return response.data;
  } catch (error) {
    if (error) {
      console.log("Error");
    }
  }
});
export const AjouterZone = createAsyncThunk(
  "zone/AjouterZone",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        lien + "/postzone",
        { denomination: data },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const zone = createSlice({
  name: "zone",
  initialState,
  reducers: {},
  extraReducers: {
    [ReadAllZone.pending]: (state, action) => {
      return {
        ...state,
        zone: [],
        addZone: "",
        addZoneError: "",
        getZone: "pending",
        getZoneError: "",
      };
    },
    [ReadAllZone.fulfilled]: (state, action) => {
      return {
        ...state,
        zone: action.payload,
        addZone: "",
        addZoneError: "",
        getZone: "success",
        getZoneError: "",
      };
    },
    [ReadAllZone.rejected]: (state, action) => {
      return {
        ...state,
        addZone: "",
        addZoneError: "",
        getZone: "rejected",
        getZoneError: action.payload,
      };
    },
    [AjouterZone.pending]: (state, action) => {
      return {
        ...state,
        addZone: "pending",
        addZoneError: "",
        getZone: "",
        getZoneError: "",
      };
    },
    [AjouterZone.fulfilled]: (state, action) => {
      return {
        ...state,
        zone: [action.payload, ...state.zone],
        addZone: "success",
        addZoneError: "",
        getZone: "",
        getZoneError: "",
      };
    },
    [AjouterZone.rejected]: (state, action) => {
      return {
        ...state,

        addZone: "rejected",
        addZoneError: action.payload,
        getZone: "",
        getZoneError: "",
      };
    },
  },
});

export default zone.reducer;
