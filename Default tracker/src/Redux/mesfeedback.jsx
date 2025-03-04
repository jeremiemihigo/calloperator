/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { config, lien_dt } from 'static/Lien';

const initialState = {
  mesfeedback: [],
  read: '',
  readError: ''
};
export const ReadMesfeedback = createAsyncThunk('mesfeedback/ReadMesfeedback', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(lien_dt + '/mesfeedback', config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const mesfeed = createSlice({
  name: 'mesfeedback',
  initialState,
  reducers: {},
  extraReducers: {
    [ReadMesfeedback.pending]: (state, action) => {
      return {
        ...state,
        read: 'pending',
        readError: ''
      };
    },
    [ReadMesfeedback.fulfilled]: (state, action) => {
      return {
        mesfeedback: action.payload,
        read: 'success',
        readError: ''
      };
    },
    [ReadMesfeedback.rejected]: (state, action) => {
      return {
        ...state,
        read: 'rejected',
        readError: action.payload
      };
    }
  }
});

export default mesfeed.reducer;
