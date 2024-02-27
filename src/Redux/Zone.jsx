/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { lien, config } from 'static/Lien';

const initialState = {
  zone: [],
  addZone: '',
  addZoneError: '',
  getZone: '',
  getZoneError: ''
};
export const ReadAllZone = createAsyncThunk('annee/readAllYear', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(lien + '/zone', config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
export const AjouterZone = createAsyncThunk('annee/AjouterAnnee', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(lien + '/postzone', { denomination: data }, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const zone = createSlice({
  name: 'zone',
  initialState,
  reducers: {},
  extraReducers: {
    [ReadAllZone.pending]: (state, action) => {
      return {
        ...state,
        zone: [],
        addZone: '',
        addZoneError: '',
        getZone: 'pending',
        getZoneError: ''
      };
    },
    [ReadAllZone.fulfilled]: (state, action) => {
      return {
        ...state,
        zone: action.payload,
        addZone: '',
        addZoneError: '',
        getZone: 'success',
        getZoneError: ''
      };
    },
    [ReadAllZone.rejected]: (state, action) => {
      return {
        ...state,
        addZone: '',
        addZoneError: '',
        getZone: 'rejected',
        getZoneError: action.payload
      };
    },
    [AjouterZone.pending]: (state, action) => {
      return {
        ...state,
        addZone: 'pending',
        addZoneError: '',
        getZone: '',
        getZoneError: ''
      };
    },
    [AjouterZone.fulfilled]: (state, action) => {
      return {
        ...state,
        zone: [action.payload, ...state.zone],
        addZone: 'success',
        addZoneError: '',
        getZone: '',
        getZoneError: ''
      };
    },
    [AjouterZone.rejected]: (state, action) => {
      return {
        ...state,

        addZone: 'rejected',
        addZoneError: action.payload,
        getZone: '',
        getZoneError: ''
      };
    }
  }
});

export default zone.reducer;
