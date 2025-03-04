/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { config, lien_read } from 'static/Lien';

const initialState = {
  zone: [],
  getZone: '',
  getZoneError: ''
};
export const ReadAllZone = createAsyncThunk('zone/readAllYear', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(lien_read + '/zone', config);
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
        getZone: 'pending',
        getZoneError: ''
      };
    },
    [ReadAllZone.fulfilled]: (state, action) => {
      return {
        ...state,
        zone: action.payload,
        getZone: 'success',
        getZoneError: ''
      };
    },
    [ReadAllZone.rejected]: (state, action) => {
      return {
        ...state,
        getZone: 'rejected',
        getZoneError: action.payload
      };
    }
  }
});

export default zone.reducer;
