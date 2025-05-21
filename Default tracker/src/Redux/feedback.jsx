/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { config, lien_post } from 'static/Lien';

const initialState = {
  feedback: [],
  getfeedback: '',
  getfeedbackError: ''
};
export const Readfeedback = createAsyncThunk('feedback/Readfeedback', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(lien_post + '/readfeedback/all', config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const feedback = createSlice({
  name: 'feedback',
  initialState,
  reducers: {},
  extraReducers: {
    [Readfeedback.pending]: (state, action) => {
      return {
        ...state,
        getfeedback: 'pending',
        getfeedbackError: ''
      };
    },
    [Readfeedback.fulfilled]: (state, action) => {
      return {
        feedback: action.payload,
        getfeedback: 'success',
        getfeedbackError: ''
      };
    },
    [Readfeedback.rejected]: (state, action) => {
      return {
        ...state,
        getfeedback: 'rejected',
        getfeedbackError: action.payload
      };
    }
  }
});

export default feedback.reducer;
