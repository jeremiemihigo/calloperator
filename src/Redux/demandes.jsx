/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { config, lien } from "static/Lien";

const initialState = {
  demande: [],
  readDemande: "",
  readDemandeError: "",
};
export const ReadDemande = createAsyncThunk("demande/ReadDemande", async () => {
  try {
    const response = await axios.get(lien + "/toutesDemandeAttente", config);
    return response.data.response;
  } catch (error) {
    if (error) {
      console.log("Error");
    }
  }
});

const demande = createSlice({
  name: "demande",
  initialState,
  reducers: {},
  extraReducers: {
    [ReadDemande.pending]: (state, action) => {
      return {
        ...state,
        readDemande: "pending",
        readDemandeError: "",
      };
    },
    [ReadDemande.fulfilled]: (state, action) => {
      return {
        ...state,
        demande: action.payload,
        readDemande: "success",
        readDemandeError: "",
      };
    },
    [ReadDemande.rejected]: (state, action) => {
      return {
        ...state,
        readDemande: "rejected",
        readDemandeError: action.payload,
      };
    },
  },
});

export default demande.reducer;
