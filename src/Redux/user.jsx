/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { lien, config } from 'static/Lien';

const initialState = {
  user: [],
  readUser: '',
  readUserError: ''
};
export const ReadUser = createAsyncThunk('user/ReadUser', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(lien + '/userAdmin', config);
    console.log(response);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: {
    [ReadUser.pending]: (state, action) => {
      return {
        ...state,
        readUser: 'pending',
        readUserError: ''
      };
    },
    [ReadUser.fulfilled]: (state, action) => {
      return {
        user: action.payload,
        readUser: 'success',
        readUserError: ''
      };
    },
    [ReadUser.rejected]: (state, action) => {
      return {
        ...state,
        readUser: 'rejected',
        readUserError: action.payload
      };
    }
  }
});

export default user.reducer;
