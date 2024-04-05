/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { lien, config } from 'static/Lien';

const initialState = {
  formation: [],
  addFormation: '',
  addFormationError: '',
  getFormation: '',
  getFormationError: ''
};
export const ReadFormation = createAsyncThunk('formation/ReadFormation', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(lien + '/formation', config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
export const AjouterFormation = createAsyncThunk('formation/AjouterFormation', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(lien + '/formation', data, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const zone = createSlice({
  name: 'formation',
  initialState,
  reducers: {},
  extraReducers: {
    [ReadFormation.pending]: (state, action) => {
      return {
        ...state,
        addFormation: '',
        addFormationError: '',
        getFormation: 'pending',
        getFormationError: ''
      };
    },
    [ReadFormation.fulfilled]: (state, action) => {
      return {
        formation: action.payload,
        addFormation: '',
        addFormationError: '',
        getFormation: 'success',
        getFormationError: ''
      };
    },
    [ReadFormation.rejected]: (state, action) => {
      return {
        ...state,
        addFormation: '',
        addFormationError: '',
        getFormation: 'rejected',
        getFormationError: action.payload
      };
    },
    [AjouterFormation.pending]: (state, action) => {
      return {
        ...state,
        addFormation: 'pending',
        addFormationError: '',
        getFormation: '',
        getFormationError: ''
      };
    },
    [AjouterFormation.fulfilled]: (state, action) => {
      return {
        ...state,
        formation: [action.payload, ...state.formation],
        addFormation: 'success',
        addFormationError: '',
        getFormation: '',
        getFormationError: ''
      };
    },
    [AjouterFormation.rejected]: (state, action) => {
      return {
        ...state,
        addFormation: 'rejected',
        addFormationError: action.payload,
        getFormation: '',
        getFormationError: ''
      };
    }
  }
});

export default zone.reducer;
