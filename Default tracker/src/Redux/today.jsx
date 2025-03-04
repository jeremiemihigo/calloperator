/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { lien_read } from 'static/Lien';

const initialState = {
  mois: '',
  readmois: '',
  readmoisError: ''
};
export const Readmois = createAsyncThunk('today/Readmois', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(lien_read + '/periodeActive');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const today = createSlice({
  name: 'today',
  initialState,
  reducers: {},
  extraReducers: {
    [Readmois.pending]: (state, action) => {
      return {
        ...state,
        readmois: 'pending',
        readmoisError: ''
      };
    },
    [Readmois.fulfilled]: (state, action) => {
      return {
        mois: action.payload,
        readmois: 'success',
        readmoisError: ''
      };
    },
    [Readmois.rejected]: (state, action) => {
      return {
        ...state,
        readmois: 'rejected',
        readmoisError: action.payload
      };
    }
  }
});

export default today.reducer;
