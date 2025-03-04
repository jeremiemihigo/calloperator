/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { config, lien_read } from 'static/Lien';

const initialState = {
  parametre: [],
  readparametre: '',
  readparametreError: ''
};
export const Readparametre = createAsyncThunk('parametre/Readparametre', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(lien_read + '/readParametre', config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const parametre = createSlice({
  name: 'parametre',
  initialState,
  reducers: {},
  extraReducers: {
    [Readparametre.pending]: (state, action) => {
      return {
        ...state,
        readparametre: 'pending',
        readparametreError: ''
      };
    },
    [Readparametre.fulfilled]: (state, action) => {
      return {
        parametre: action.payload,
        readparametre: 'success',
        readparametreError: ''
      };
    },
    [Readparametre.rejected]: (state, action) => {
      return {
        ...state,
        readparametre: 'rejected',
        readparametreError: action.payload
      };
    }
  }
});

export default parametre.reducer;
