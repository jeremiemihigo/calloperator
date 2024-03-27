/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { config, lien_conge } from 'static/Lien';

const initialState = {
  contrat: [],
  addContrat: '',
  addContratError: '',
  readContrat: '',
  readContratError: '',
  updateContrat: '',
  updateContratError: ''
};
export const ReadContrat = createAsyncThunk('contrat/ReadContrat', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(lien_conge + '/contrat', config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
export const AjouterContrat = createAsyncThunk('contrat/AjouterContrat', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(lien_conge + '/contrat', data, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
export const UpdateContrat = createAsyncThunk('contrat/UpdateContrat', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.put(lien_conge + '/contrat', data, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const contrat = createSlice({
  name: 'contrat',
  initialState,
  reducers: {},
  extraReducers: {
    [ReadContrat.pending]: (state, action) => {
      return {
        ...state,
        addContrat: '',
        addContratError: '',
        readContrat: '',
        readContratError: '',
        updateContrat: '',
        updateContratError: ''
      };
    },
    [ReadContrat.fulfilled]: (state, action) => {
      return {
        contrat: action.payload,
        addContrat: '',
        addContratError: '',
        readContrat: 'success',
        readContratError: '',
        updateContrat: '',
        updateContratError: ''
      };
    },
    [ReadContrat.rejected]: (state, action) => {
      return {
        ...state,
        addContrat: '',
        addContratError: '',
        readContrat: 'rejected',
        readContratError: action.payload,
        updateContrat: '',
        updateContratError: ''
      };
    },
    [AjouterContrat.pending]: (state, action) => {
      return {
        ...state,
        addContrat: 'pending',
        addContratError: '',
        readContrat: '',
        readContratError: '',
        updateContrat: '',
        updateContratError: ''
      };
    },
    [AjouterContrat.fulfilled]: (state, action) => {
      return {
        contrat: [action.payload, ...state.contrat],
        addContrat: 'success',
        addContratError: '',
        readContrat: '',
        readContratError: '',
        updateContrat: '',
        updateContratError: ''
      };
    },
    [AjouterContrat.rejected]: (state, action) => {
      return {
        ...state,
        addContrat: 'rejected',
        addContratError: action.payload,
        readContrat: '',
        readContratError: '',
        updateContrat: '',
        updateContratError: ''
      };
    },
    [UpdateContrat.pending]: (state, action) => {
      return {
        ...state,
        addContrat: '',
        addContratError: '',
        readContrat: '',
        readContratError: '',
        updateContrat: 'pending',
        updateContratError: ''
      };
    },
    [UpdateContrat.fulfilled]: (state, action) => {
      const updatings = state.contrat.map((x) => (x._id === action.payload._id ? action.payload : x));
      return {
        agent: updatings,
        addContrat: '',
        addContratError: '',
        readContrat: '',
        readContratError: '',
        updateContrat: 'success',
        updateContratError: ''
      };
    },
    [UpdateContrat.rejected]: (state, action) => {
      return {
        ...state,

        addAgent: '',
        addContrat: '',
        addContratError: '',
        readContrat: '',
        readContratError: '',
        updateContrat: 'rejected',
        updateContratError: action.payload
      };
    }
  }
});

export default contrat.reducer;
