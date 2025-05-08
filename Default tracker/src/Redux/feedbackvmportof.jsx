/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { config, lien_read } from 'static/Lien';

const initialState = {
  feedback: [],
  readfeedback: '',
  readfeedbackError: ''
};
export const ReadfeedbackPortoVm = createAsyncThunk('feedbackporto/ReadfeedbackPortoVm', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(lien_read + '/readfeedback/all', config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const feedback = createSlice({
  name: 'feedbackporto',
  initialState,
  reducers: {},
  extraReducers: {
    [ReadfeedbackPortoVm.pending]: (state, action) => {
      return {
        ...state,
        readfeedback: 'pending',
        readfeedbackError: ''
      };
    },
    [ReadfeedbackPortoVm.fulfilled]: (state, action) => {
      return {
        feedback: action.payload,
        readfeedback: 'success',
        readfeedbackError: ''
      };
    },
    [ReadfeedbackPortoVm.rejected]: (state, action) => {
      return {
        ...state,
        readfeedback: 'rejected',
        readfeedbackError: action.payload
      };
    }
  }
});

export default feedback.reducer;
