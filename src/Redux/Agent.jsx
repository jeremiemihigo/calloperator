/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { lien, config } from 'static/Lien';

const initialState = {
  agent: [],
  addAgent: '',
  addAgentError: '',
  getAgent: '',
  getAgentError: '',
  updateAgent: '',
  updateAgentError: '',
  bloquer: '',
  bloquerError: ''
};
export const ReadAgent = createAsyncThunk('agent/ReadAgent', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(lien + '/agent', config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
export const AjouterAgent = createAsyncThunk('agent/AjouterAgent', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(lien + '/postAgent', data, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
export const UpdateAgent = createAsyncThunk('agent/UpdateAgent', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.put(lien + '/agent', data, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
export const BloquerAgent = createAsyncThunk('agent/UpdateAgent', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.put(lien + '/bloquer', data, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const agent = createSlice({
  name: 'agent',
  initialState,
  reducers: {},
  extraReducers: {
    [ReadAgent.pending]: (state, action) => {
      return {
        ...state,
        addAgent: '',
        addAgentError: '',
        getAgent: 'pending',
        getAgentError: '',
        updateAgent: '',
        updateAgentError: '',
        bloquer: '',
        bloquerError: ''
      };
    },
    [ReadAgent.fulfilled]: (state, action) => {
      return {
        ...state,
        agent: action.payload,
        addAgent: '',
        addAgentError: '',
        getAgent: 'success',
        getAgentError: '',
        updateAgent: '',
        updateAgentError: '',
        bloquer: '',
        bloquerError: ''
      };
    },
    [ReadAgent.rejected]: (state, action) => {
      return {
        ...state,
        addAgent: '',
        addAgentError: '',
        getAgent: 'rejected',
        getAgentError: action.payload,
        updateAgent: '',
        updateAgentError: '',
        bloquer: '',
        bloquerError: ''
      };
    },
    [AjouterAgent.pending]: (state, action) => {
      return {
        ...state,
        addAgent: 'pending',
        addAgentError: '',
        getAgent: '',
        getAgentError: '',
        updateAgent: '',
        updateAgentError: '',
        bloquer: '',
        bloquerError: ''
      };
    },
    [AjouterAgent.fulfilled]: (state, action) => {
      return {
        agent: [action.payload, ...state.agent],
        addAgent: 'success',
        addAgentError: '',
        getAgent: '',
        getAgentError: '',
        updateAgent: '',
        updateAgentError: '',
        bloquer: '',
        bloquerError: ''
      };
    },
    [AjouterAgent.rejected]: (state, action) => {
      return {
        ...state,

        addAgent: 'rejected',
        addAgentError: action.payload,
        getAgent: '',
        getAgentError: '',
        updateAgent: '',
        updateAgentError: '',
        bloquer: '',
        bloquerError: ''
      };
    },
    [UpdateAgent.pending]: (state, action) => {
      return {
        ...state,
        addAgent: '',
        addAgentError: '',
        getAgent: '',
        getAgentError: '',
        updateAgent: 'pending',
        updateAgentError: '',
        bloquer: '',
        bloquerError: ''
      };
    },
    [UpdateAgent.fulfilled]: (state, action) => {
      const updatings = state.agent.map((x) => (x._id === action.payload._id ? action.payload : x));
      return {
        agent: updatings,
        addAgent: '',
        addAgentError: '',
        getAgent: '',
        getAgentError: '',
        updateAgent: 'success',
        updateAgentError: '',
        bloquer: '',
        bloquerError: ''
      };
    },
    [UpdateAgent.rejected]: (state, action) => {
      return {
        ...state,

        addAgent: '',
        addAgentError: '',
        getAgent: '',
        getAgentError: '',
        updateAgent: 'rejected',
        updateAgentError: action.payload,
        bloquer: '',
        bloquerError: ''
      };
    },
    [BloquerAgent.pending]: (state, action) => {
      return {
        ...state,
        addAgent: '',
        addAgentError: '',
        getAgent: '',
        getAgentError: '',
        updateAgent: '',
        updateAgentError: '',
        bloquer: 'pending',
        bloquerError: ''
      };
    },
    [BloquerAgent.fulfilled]: (state, action) => {
      const updatingsb = state.agent.map((x) => (x._id === action.payload._id ? action.payload : x));
      return {
        agent: updatingsb,
        addAgent: '',
        addAgentError: '',
        getAgent: '',
        getAgentError: '',
        updateAgent: '',
        updateAgentError: '',
        bloquer: 'success',
        bloquerError: ''
      };
    },
    [BloquerAgent.rejected]: (state, action) => {
      return {
        ...state,

        addAgent: '',
        addAgentError: '',
        getAgent: '',
        getAgentError: '',
        updateAgent: '',
        updateAgentError: '',
        bloquer: 'rejected',
        bloquerError: action.payload
      };
    }
  }
});

export default agent.reducer;
