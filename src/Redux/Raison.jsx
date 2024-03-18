/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { lien, config } from 'static/Lien';

const initialState = {
  raison: [],
  readRaison: '',
  readRaisonError: '',
  postRaison: '',
  postRaisonError: '',
  updateRaison: '',
  updateRaisonError: ''
};
export const AddRaison = createAsyncThunk('raison/AddRaison', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(lien + '/raison', data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
export const ReadRaison = createAsyncThunk('raison/ReadRaison', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.get(lien + '/raison');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
export const updateRaison = createAsyncThunk('raison/updateRaison', async (data, { rejectWithValue }) => {
  try {
    const { id, raison } = data;
    const response = await axios.put(lien + '/raison', { id, raison });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const demande = createSlice({
  name: 'demande',
  initialState,
  reducers: {},
  extraReducers: {
    [AddRaison.pending]: (state, action) => {
      return {
        ...state,
        readRaison: '',
        readRaisonError: '',
        postRaison: 'pending',
        postRaisonError: '',
        updateRaison: '',
        updateRaisonError: ''
      };
    },
    [AddRaison.fulfilled]: (state, action) => {
      return {
        ...state,
        raison: [action.payload, ...state.raison],
        readRaison: '',
        readRaisonError: '',
        postRaison: 'success',
        postRaisonError: '',
        updateRaison: '',
        updateRaisonError: ''
      };
    },
    [AddRaison.rejected]: (state, action) => {
      return {
        ...state,
        readRaison: '',
        readRaisonError: '',
        postRaison: 'rejected',
        postRaisonError: action.payload,
        updateRaison: '',
        updateRaisonError: ''
      };
    },
    [ReadRaison.pending]: (state, action) => {
      return {
        ...state,
        readRaison: 'pending',
        readRaisonError: '',
        postRaison: '',
        postRaisonError: '',
        updateRaison: '',
        updateRaisonError: ''
      };
    },
    [ReadRaison.fulfilled]: (state, action) => {
      return {
        ...state,
        raison: action.payload,
        readRaison: 'success',
        readRaisonError: '',
        postRaison: '',
        postRaisonError: '',
        updateRaison: '',
        updateRaisonError: ''
      };
    },
    [ReadRaison.rejected]: (state, action) => {
      return {
        ...state,
        readRaison: 'rejected',
        readRaisonError: action.payload,
        postRaison: '',
        postRaisonError: '',
        updateRaison: '',
        updateRaisonError: ''
      };
    },
    [updateRaison.pending]: (state, action) => {
      return {
        ...state,
        readRaison: '',
        readRaisonError: '',
        postRaison: '',
        postRaisonError: '',
        updateRaison: 'pending',
        updateRaisonError: ''
      };
    },
    [updateRaison.fulfilled]: (state, action) => {
      const donner = state.raison.map((x) => (x._id === action.payload._id ? action.payload : x));
      return {
        ...state,
        raison: donner,
        readRaison: '',
        readRaisonError: '',
        postRaison: '',
        postRaisonError: '',
        updateRaison: 'success',
        updateRaisonError: ''
      };
    },
    [updateRaison.rejected]: (state, action) => {
      return {
        ...state,
        readRaison: '',
        readRaisonError: '',
        postRaison: '',
        postRaisonError: '',
        updateRaison: 'rejected',
        updateRaisonError: action.payload
      };
    }
  }
});

export default demande.reducer;
