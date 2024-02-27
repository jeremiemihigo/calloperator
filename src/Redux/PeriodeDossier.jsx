/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { lien, config } from 'static/Lien';

const initialState = {
  periode: [],
  getPeriode: '',
  getPeriodeError: ''
};
export const ReadPeriode = createAsyncThunk('PeriodeDossier/ReadPeriode', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(lien + '/paquet/tout', config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const periode = createSlice({
  name: 'periode',
  initialState,
  reducers: {},
  extraReducers: {
    [ReadPeriode.pending]: (state, action) => {
      return {
        ...state,
        periode: [],
        getPeriode: 'pending',
        getPeriodeError: ''
      };
    },
    [ReadPeriode.fulfilled]: (state, action) => {
      return {
        periode: action.payload,
        getPeriode: 'success',
        getPeriodeError: ''
      };
    },
    [ReadPeriode.rejected]: (state, action) => {
      return {
        ...state,
        getPeriode: 'rejected',
        getPeriodeError: action.payload
      };
    }
  }
});

export default periode.reducer;
