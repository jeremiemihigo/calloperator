/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { config, lien_dt } from 'static/Lien';

const initialState = {
  feedback: [],
  getfeedback: '',
  getfeedbackError: '',
  postfeedback: '',
  postfeedbackError: '',
  editfeedback: '',
  editfeedbackError: ''
};
export const Readfeedback = createAsyncThunk('feedback/Readfeedback', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(lien_dt + '/feedback', config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
export const Postfeedback = createAsyncThunk('feedback/Postfeedback', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(lien_dt + '/feedback', data, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
export const Editfeedback = createAsyncThunk('feedback/Editfeedback', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.put(lien_dt + '/editfeedback', data, config);
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
        getfeedbackError: '',
        postfeedback: '',
        postfeedbackError: '',
        editfeedback: '',
        editfeedbackError: ''
      };
    },
    [Readfeedback.fulfilled]: (state, action) => {
      return {
        feedback: action.payload,
        getfeedback: 'success',
        getfeedbackError: '',
        postfeedback: '',
        postfeedbackError: '',
        editfeedback: '',
        editfeedbackError: ''
      };
    },
    [Readfeedback.rejected]: (state, action) => {
      return {
        ...state,
        getfeedback: 'rejected',
        getfeedbackError: action.payload,
        postfeedback: '',
        postfeedbackError: '',
        editfeedback: '',
        editfeedbackError: ''
      };
    },
    [Postfeedback.pending]: (state, action) => {
      return {
        ...state,
        getfeedback: '',
        getfeedbackError: '',
        postfeedback: 'pending',
        postfeedbackError: '',
        editfeedback: '',
        editfeedbackError: ''
      };
    },
    [Postfeedback.fulfilled]: (state, action) => {
      return {
        feedback: [action.payload, ...state.feedback],
        getfeedback: 'success',
        getfeedbackError: '',
        postfeedback: '',
        postfeedbackError: '',
        editfeedback: '',
        editfeedbackError: ''
      };
    },
    [Postfeedback.rejected]: (state, action) => {
      return {
        ...state,
        getfeedback: '',
        getfeedbackError: '',
        postfeedback: 'rejected',
        postfeedbackError: action.payload,
        editfeedback: '',
        editfeedbackError: ''
      };
    },
    [Editfeedback.pending]: (state, action) => {
      return {
        ...state,
        getfeedback: '',
        getfeedbackError: '',
        postfeedback: '',
        postfeedbackError: '',
        editfeedback: 'pending',
        editfeedbackError: ''
      };
    },
    [Editfeedback.fulfilled]: (state, action) => {
      const feed = state.feedback.map((x) => (x._id === action.payload._id ? action.payload : x));
      return {
        feedback: feed,
        getfeedback: '',
        getfeedbackError: '',
        postfeedback: '',
        postfeedbackError: '',
        editfeedback: 'success',
        editfeedbackError: ''
      };
    },
    [Editfeedback.rejected]: (state, action) => {
      return {
        ...state,
        getfeedback: '',
        getfeedbackError: '',
        postfeedback: '',
        postfeedbackError: '',
        editfeedback: 'rejected',
        editfeedbackError: action.payload
      };
    }
  }
});

export default feedback.reducer;
