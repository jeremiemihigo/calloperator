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
  updateRaisonError: '',
  deleteRaison: '',
  deleteRaisonError: ''
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
export const deleteRaison = createAsyncThunk('raison/deleteRaison', async (data, { rejectWithValue }) => {
  try {
    const { id } = data;
    const response = await axios.delete(lien + '/raison', { id });
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
        updateRaisonError: '',
        deleteRaison: '',
        deleteRaisonError: ''
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
        updateRaisonError: '',
        deleteRaison: '',
        deleteRaisonError: ''
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
        updateRaisonError: '',
        deleteRaison: '',
        deleteRaisonError: ''
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
        updateRaisonError: '',
        deleteRaison: '',
        deleteRaisonError: ''
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
        updateRaisonError: '',
        deleteRaison: '',
        deleteRaisonError: ''
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
        updateRaisonError: '',
        deleteRaison: '',
        deleteRaisonError: ''
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
        updateRaisonError: '',
        deleteRaison: '',
        deleteRaisonError: ''
      };
    },
    [updateRaison.fulfilled]: (state, action) => {
      const donner = state.raison.map(x=>x._id === action.payload._id ? action.payload : x)
      return {
        ...state,
        raison: donner,
        readRaison: '',
        readRaisonError: '',
        postRaison: '',
        postRaisonError: '',
        updateRaison: 'success',
        updateRaisonError: '',
        deleteRaison: '',
        deleteRaisonError: ''
      };
    },
    [updateRaison.rejected]: (state, action) => {
      return {
        ...state,
        readRaison: '',
        readRaisonError: "",
        postRaison: '',
        postRaisonError: '',
        updateRaison: 'rejected',
        updateRaisonError: action.payload,
        deleteRaison: '',
        deleteRaisonError: ''
      };
    },
    [deleteRaison.pending]: (state, action) => {
      return {
        ...state,
        readRaison: '',
        readRaisonError: '',
        postRaison: '',
        postRaisonError: '',
        updateRaison: '',
        updateRaisonError: '',
        deleteRaison: 'pending',
        deleteRaisonError: ''
      };
    },
    [deleteRaison.fulfilled]: (state, action) => {
      const donner = state.raison.filter(x=>x!== action.payload._id)
      return {
        ...state,
        raison: donner,
        readRaison: '',
        readRaisonError: '',
        postRaison: '',
        postRaisonError: '',
        updateRaison: '',
        updateRaisonError: '',
        deleteRaison: 'success',
        deleteRaisonError: ''
      };
    },
    [deleteRaison.rejected]: (state, action) => {
      return {
        ...state,
        readRaison: '',
        readRaisonError: "",
        postRaison: '',
        postRaisonError: '',
        updateRaison: '',
        updateRaisonError: "",
        deleteRaison: 'rejected',
        deleteRaisonError: action.payload
      };
    }
  }
});

export default demande.reducer;
