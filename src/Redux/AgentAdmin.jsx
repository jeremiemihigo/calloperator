/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { lien, config } from 'static/Lien';

const initialState = {
  agentAdmin: [],
  addAgent: '',
  addAgentError: '',
  readAgent: '',
  readAgentError: ''
};
export const ReadAgentAdmin = createAsyncThunk('agentAdmin/ReadAgent', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(lien + '/readAgentAdmin', config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
export const AjouterAgentAdmin = createAsyncThunk('agentAdmin/AjouterAgentAdmin', async (data, { rejectWithValue }) => {
  try {
    console.log(data);
    const response = await axios.post(lien + '/addAdminAgent', data, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const agent = createSlice({
  name: 'agentAdmin',
  initialState,
  reducers: {},
  extraReducers: {
    [ReadAgentAdmin.pending]: (state, action) => {
      return {
        ...state,
        addAgent: '',
        addAgentError: '',
        readAgent: 'pending',
        readAgentError: ''
      };
    },
    [ReadAgentAdmin.fulfilled]: (state, action) => {
      return {
        ...state,
        agentAdmin: action.payload,
        addAgent: '',
        addAgentError: '',
        readAgent: 'success',
        readAgentError: ''
      };
    },
    [ReadAgentAdmin.rejected]: (state, action) => {
      return {
        ...state,
        addAgent: '',
        addAgentError: '',
        readAgent: 'rejected',
        readAgentError: action.payload
      };
    },
    [AjouterAgentAdmin.pending]: (state, action) => {
      return {
        ...state,
        addAgent: 'pending',
        addAgentError: '',
        readAgent: '',
        readAgentError: ''
      };
    },
    [AjouterAgentAdmin.fulfilled]: (state, action) => {
      return {
        agentAdmin: [action.payload, ...state.agentAdmin],
        addAgent: 'success',
        addAgentError: '',
        readAgent: '',
        readAgentError: ''
      };
    },
    [AjouterAgentAdmin.rejected]: (state, action) => {
      return {
        ...state,
        addAgent: 'rejected',
        addAgentError: action.payload,
        readAgent: '',
        readAgentError: ''
      };
    }
  }
});

export default agent.reducer;
