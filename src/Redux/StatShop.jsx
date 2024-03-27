/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { lien, config } from 'static/Lien';

const initialState = {
  stat: [],
  getStat: '',
  getStatError: ''
};
export const ReadStat = createAsyncThunk('StatShop/ReadStat', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(lien + '/statZone', config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const stat = createSlice({
  name: 'stat',
  initialState,
  reducers: {},
  extraReducers: {
    [ReadStat.pending]: (state, action) => {
      return {
        ...state,
        getStat: 'pending',
        getStatError: ''
      };
    },
    [ReadStat.fulfilled]: (state, action) => {
      return {
        ...state,
        stat: action.payload,
        getStat: 'success',
        getStatError: ''
      };
    },
    [ReadStat.rejected]: (state, action) => {
      return {
        ...state,
        getStat: 'rejected',
        getStatError: action.payload
      };
    }
  }
});

export default stat.reducer;
