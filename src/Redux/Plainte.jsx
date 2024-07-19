/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { config, lien_issue } from 'static/Lien';

const initialState = {
  plainte: [],
  addPlainte: '',
  addPlainteError: '',
  getPlainte: '',
  getPlainteError: ''
};
export const ReadPlainte = createAsyncThunk('Plainte/ReadPlainte', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(lien_issue + '/plainte');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
export const AjouterPlainte = createAsyncThunk('Plainte/AjouterPlainte', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(lien_issue + '/plainte', data, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
export const AddItemPlainte = createAsyncThunk('Plainte/AddItemPlainte', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(lien_issue + '/itemPlainte', data, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const zone = createSlice({
  name: 'Plainte',
  initialState,
  reducers: {},
  extraReducers: {
    [ReadPlainte.pending]: (state, action) => {
      return {
        ...state,
        addPlainte: '',
        addPlainteError: '',
        getPlainte: 'pending',
        getPlainteError: '',
        addItem: '',
        addItemError: ''
      };
    },
    [ReadPlainte.fulfilled]: (state, action) => {
      return {
        plainte: action.payload,
        addPlainte: '',
        addPlainteError: '',
        getPlainte: 'success',
        getPlainteError: '',
        addItem: '',
        addItemError: ''
      };
    },
    [ReadPlainte.rejected]: (state, action) => {
      return {
        ...state,
        addPlainte: '',
        addPlainteError: '',
        getPlainte: 'rejected',
        getPlainteError: action.payload,
        addItem: '',
        addItemError: ''
      };
    },
    [AjouterPlainte.pending]: (state, action) => {
      return {
        ...state,
        addPlainte: 'pending',
        addPlainteError: '',
        getPlainte: '',
        getPlainteError: '',
        addItem: '',
        addItemError: ''
      };
    },
    [AjouterPlainte.fulfilled]: (state, action) => {
      return {
        ...state,
        plainte: [...state.plainte, action.payload],
        addPlainte: 'success',
        addPlainteError: '',
        getPlainte: '',
        getPlainteError: '',
        addItem: '',
        addItemError: ''
      };
    },
    [AjouterPlainte.rejected]: (state, action) => {
      return {
        ...state,
        addPlainte: 'rejected',
        addPlainteError: action.payload,
        getPlainte: '',
        getPlainteError: '',
        addItem: '',
        addItemError: ''
      };
    },
    [AddItemPlainte.pending]: (state, action) => {
      return {
        ...state,
        addPlainte: 'pending',
        addPlainteError: '',
        getPlainte: '',
        getPlainteError: '',
        addItem: '',
        addItemError: ''
      };
    },
    [AddItemPlainte.fulfilled]: (state, action) => {
      const p = state.plainte.map((x) => (x.id === action.payload.id ? action.payload : x));
      return {
        plainte: p,
        addPlainte: 'success',
        addPlainteError: '',
        getPlainte: '',
        getPlainteError: '',
        addItem: '',
        addItemError: ''
      };
    },
    [AddItemPlainte.rejected]: (state, action) => {
      return {
        ...state,
        addPlainte: 'rejected',
        addPlainteError: action.payload,
        getPlainte: '',
        getPlainteError: '',
        addItem: '',
        addItemError: ''
      };
    }
  }
});

export default zone.reducer;
