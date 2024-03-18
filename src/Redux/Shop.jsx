/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { lien, config } from 'static/Lien';

const initialState = {
  shop: [],
  addShop: '',
  addShopError: '',
  updateShop: '',
  updateShopError: '',
  readShop: '',
  readShopError: ''
};
export const ReadShop = createAsyncThunk('shop/ReadShop', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(lien + '/shop', config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
export const AjouterShop = createAsyncThunk('shop/AjouterShop', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(lien + '/shop', data, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
export const UpdateShop = createAsyncThunk('shop/UpdateShop', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.put(lien + '/shop', data, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const zone = createSlice({
  name: 'zone',
  initialState,
  reducers: {},
  extraReducers: {
    [ReadShop.pending]: (state, action) => {
      return {
        ...state,
        addShop: '',
        addShopError: '',
        updateShop: '',
        updateShopError: '',
        readShop: 'pending',
        readShopError: ''
      };
    },
    [ReadShop.fulfilled]: (state, action) => {
      return {
        ...state,
        shop: action.payload,
        addShop: '',
        addShopError: '',
        updateShop: '',
        updateShopError: '',
        readShop: 'success',
        readShopError: ''
      };
    },
    [ReadShop.rejected]: (state, action) => {
      return {
        ...state,
        addShop: '',
        addShopError: '',
        updateShop: '',
        updateShopError: '',
        readShop: 'rejected',
        readShopError: action.payload
      };
    },
    [AjouterShop.pending]: (state, action) => {
      return {
        ...state,
        addShop: 'pending',
        addShopError: '',
        updateShop: '',
        updateShopError: '',
        readShop: '',
        readShopError: ''
      };
    },
    [AjouterShop.fulfilled]: (state, action) => {
      return {
        ...state,
        shop: [action.payload, ...state.shop],
        addShop: 'success',
        addShopError: '',
        updateShop: '',
        updateShopError: '',
        readShop: '',
        readShopError: ''
      };
    },
    [AjouterShop.rejected]: (state, action) => {
      return {
        ...state,
        addShop: 'rejected',
        addShopError: action.payload,
        updateShop: '',
        updateShopError: '',
        readShop: '',
        readShopError: ''
      };
    },
    [UpdateShop.pending]: (state, action) => {
      return {
        ...state,
        addShop: '',
        addShopError: '',
        updateShop: 'pending',
        updateShopError: '',
        readShop: '',
        readShopError: ''
      };
    },
    [UpdateShop.fulfilled]: (state, action) => {
      let sho = state.shop.map((x) => (x._id === action.payload._id ? x : action.payload));
      return {
        ...state,
        shop: sho,
        addShop: '',
        addShopError: '',
        updateShop: 'success',
        updateShopError: '',
        readShop: '',
        readShopError: ''
      };
    },
    [UpdateShop.rejected]: (state, action) => {
      return {
        ...state,
        addShop: '',
        addShopError: '',
        updateShop: 'rejected',
        updateShopError: action.payload,
        readShop: '',
        readShopError: ''
      };
    }
  }
});

export default zone.reducer;
