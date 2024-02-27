/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { lien, config } from 'static/Lien';

const initialState = {
  periodeActive: [],
  getPeriode: '',
  getPeriodeError: ''
};
export const ReadPeriodeActive = createAsyncThunk('periodeActive/ReadPeriodeActive', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(lien + '/periodeActive', config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const periodeActive = createSlice({
  name: 'periodeActive',
  initialState,
  reducers: {},
  extraReducers: {
    [ReadPeriodeActive.pending]: (state, action) => {
      return {
        ...state,
        getPeriode: 'pending',
        getPeriodeError: ''
      };
    },
    [ReadPeriodeActive.fulfilled]: (state, action) => {
      return {
        periodeActive: action.payload,
        getPeriode: 'success',
        getPeriodeError: ''
      };
    },
    [ReadPeriodeActive.rejected]: (state, action) => {
      return {
        ...state,
        getPeriode: 'rejected',
        getPeriodeError: action.payload
      };
    }
  }
});

export default periodeActive.reducer;
