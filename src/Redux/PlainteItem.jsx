/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { config, lien_issue } from 'static/Lien';

const initialState = {
  plainteItem: [],
  readplainteItem: '',
  readplainteItemError: ''
};
export const ReadplainteItem = createAsyncThunk('plainteItem/ReadplainteItem', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(lien_issue + '/itemPlainte', config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const plainteItem = createSlice({
  name: 'plainteItem',
  initialState,
  reducers: {},
  extraReducers: {
    [ReadplainteItem.pending]: (state, action) => {
      return {
        ...state,
        readplainteItem: 'pending',
        readplainteItemError: ''
      };
    },
    [ReadplainteItem.fulfilled]: (state, action) => {
      return {
        plainteItem: action.payload,
        readplainteItem: 'success',
        readplainteItemError: ''
      };
    },
    [ReadplainteItem.rejected]: (state, action) => {
      return {
        ...state,
        readplainteItem: 'rejected',
        readplainteItemError: action.payload
      };
    }
  }
});

export default plainteItem.reducer;
