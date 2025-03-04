/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { config, lien_read } from 'static/Lien';

const initialState = {
  shop: [],
  readShop: '',
  readShopError: ''
};
export const ReadShop = createAsyncThunk('shop/ReadShop', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(lien_read + '/shop', config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const zone = createSlice({
  name: 'shop',
  initialState,
  reducers: {},
  extraReducers: {
    [ReadShop.pending]: (state, action) => {
      return {
        ...state,
        readShop: 'pending',
        readShopError: ''
      };
    },
    [ReadShop.fulfilled]: (state, action) => {
      return {
        ...state,
        shop: action.payload,
        readShop: 'success',
        readShopError: ''
      };
    },
    [ReadShop.rejected]: (state, action) => {
      return {
        ...state,
        readShop: 'rejected',
        readShopError: action.payload
      };
    }
  }
});

export default zone.reducer;
