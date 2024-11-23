/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { config, lien } from 'static/Lien';

const initialState = {
  parametre: [],
  getParametre: '',
  getParametreError: ''
};
export const ReadParametre = createAsyncThunk('Parametre/ReadParametre', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(lien + '/readParametre', config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const Parametre = createSlice({
  name: 'Parametre',
  initialState,
  reducers: {},
  extraReducers: {
    [ReadParametre.pending]: (state, action) => {
      return {
        ...state,
        getParametre: 'pending',
        getParametreError: ''
      };
    },
    [ReadParametre.fulfilled]: (state, action) => {
      return {
        parametre: action.payload,
        getParametre: 'success',
        getParametreError: ''
      };
    },
    [ReadParametre.rejected]: (state, action) => {
      return {
        ...state,
        getParametre: 'rejected',
        getParametreError: action.payload
      };
    }
  }
});

export default Parametre.reducer;
