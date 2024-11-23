/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { config, lien_dt } from 'static/Lien';

const initialState = {
  role: [],
  getrole: '',
  getroleError: '',
  postrole: '',
  postroleError: ''
};
export const Readrole = createAsyncThunk('role/Readrole', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(lien_dt + '/role', config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
export const Postrole = createAsyncThunk('role/Postrole', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(lien_dt + '/role', data, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const role = createSlice({
  name: 'role',
  initialState,
  reducers: {},
  extraReducers: {
    [Readrole.pending]: (state, action) => {
      return {
        ...state,
        getrole: 'pending',
        getroleError: '',
        postrole: '',
        postroleError: ''
      };
    },
    [Readrole.fulfilled]: (state, action) => {
      return {
        role: action.payload,
        getrole: 'success',
        getroleError: '',
        postrole: '',
        postroleError: ''
      };
    },
    [Readrole.rejected]: (state, action) => {
      return {
        ...state,
        getrole: 'rejected',
        getroleError: action.payload,
        postrole: '',
        postroleError: ''
      };
    },
    [Postrole.pending]: (state, action) => {
      return {
        ...state,
        getrole: '',
        getroleError: '',
        postrole: 'pending',
        postroleError: ''
      };
    },
    [Postrole.fulfilled]: (state, action) => {
      return {
        role: [action.payload, ...state.role],
        getrole: 'success',
        getroleError: '',
        postrole: '',
        postroleError: ''
      };
    },
    [Postrole.rejected]: (state, action) => {
      return {
        ...state,
        getrole: '',
        getroleError: '',
        postrole: 'rejected',
        postroleError: action.payload
      };
    }
  }
});

export default role.reducer;
