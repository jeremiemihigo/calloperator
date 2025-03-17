/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { config, lien } from "static/Lien";

const initialState = {
  agentAdmin: [],
  addAgent: "",
  addAgentError: "",
  readAgent: "",
  readAgentError: "",
  otherUpdated: "",
  otherUpdatedError: "",
};
export const ReadAgentAdmin = createAsyncThunk(
  "agentAdmin/ReadAgentAdmin",
  async () => {
    try {
      const response = await axios.get(lien + "/readAgentAdmin", config);
      return response.data;
    } catch (error) {
      if (error) {
        console.log("Error");
      }
    }
  }
);
export const AjouterAgentAdmin = createAsyncThunk(
  "agentAdmin/AjouterAgentAdmin",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(lien + "/addAdminAgent", data, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const OtherUpdated = createAsyncThunk(
  "agentAdmin/OtherUpdated",
  async (donner, { rejectWithValue }) => {
    try {
      const { idAgent, data, unset } = donner;
      const response = await axios.post(
        `${lien}/edituseradminInfo`,
        { data, unset, idAgent },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const agent = createSlice({
  name: "agentAdmin",
  initialState,
  reducers: {},
  extraReducers: {
    [ReadAgentAdmin.pending]: (state, action) => {
      return {
        ...state,
        addAgent: "",
        addAgentError: "",
        readAgent: "pending",
        readAgentError: "",
        otherUpdated: "",
        otherUpdatedError: "",
      };
    },
    [ReadAgentAdmin.fulfilled]: (state, action) => {
      return {
        ...state,
        agentAdmin: action.payload,
        addAgent: "",
        addAgentError: "",
        readAgent: "success",
        readAgentError: "",
        otherUpdated: "",
        otherUpdatedError: "",
      };
    },
    [ReadAgentAdmin.rejected]: (state, action) => {
      return {
        ...state,
        addAgent: "",
        addAgentError: "",
        readAgent: "rejected",
        readAgentError: action.payload,
        otherUpdated: "",
        otherUpdatedError: "",
      };
    },
    [AjouterAgentAdmin.pending]: (state, action) => {
      return {
        ...state,
        addAgent: "pending",
        addAgentError: "",
        readAgent: "",
        readAgentError: "",
        otherUpdated: "",
        otherUpdatedError: "",
      };
    },
    [AjouterAgentAdmin.fulfilled]: (state, action) => {
      return {
        agentAdmin: [action.payload, ...state.agentAdmin],
        addAgent: "success",
        addAgentError: "",
        readAgent: "",
        readAgentError: "",
        otherUpdated: "",
        otherUpdatedError: "",
      };
    },
    [AjouterAgentAdmin.rejected]: (state, action) => {
      return {
        ...state,
        addAgent: "rejected",
        addAgentError: action.payload,
        readAgent: "",
        readAgentError: "",
        otherUpdated: "",
        otherUpdatedError: "",
      };
    },
    [OtherUpdated.pending]: (state, action) => {
      return {
        ...state,
        addAgent: "",
        addAgentError: "",
        readAgent: "",
        readAgentError: "",
        otherUpdated: "pending",
        otherUpdatedError: "",
      };
    },
    [OtherUpdated.fulfilled]: (state, action) => {
      let l = state.agentAdmin.map((x) =>
        x._id === action.payload._id ? action.payload : x
      );
      return {
        agentAdmin: l,
        addAgent: "",
        addAgentError: "",
        readAgent: "",
        readAgentError: "",
        otherUpdated: "success",
        otherUpdatedError: "",
      };
    },
    [OtherUpdated.rejected]: (state, action) => {
      return {
        ...state,
        addAgent: "",
        addAgentError: "",
        readAgent: "",
        readAgentError: "",
        otherUpdated: "rejected",
        otherUpdatedError: action.payload,
      };
    },
  },
});

export default agent.reducer;
