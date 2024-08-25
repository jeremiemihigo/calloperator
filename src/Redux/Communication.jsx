/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { config, lien } from 'static/Lien';

const initialState = {
  communication: [],
  addcommunication: '',
  addcommunicationError: '',
  getcommunication: '',
  getcommunicationError: ''
};
export const Readcommunication = createAsyncThunk('communication/Readcommunication', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(lien + '/communication', config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
export const Ajoutercommunication = createAsyncThunk('communication/Ajoutercommunication', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(lien + '/communication', data, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const zone = createSlice({
  name: 'communication',
  initialState,
  reducers: {},
  extraReducers: {
    [Readcommunication.pending]: (state, action) => {
      return {
        ...state,
        addcommunication: '',
        addcommunicationError: '',
        getcommunication: 'pending',
        getcommunicationError: ''
      };
    },
    [Readcommunication.fulfilled]: (state, action) => {
      return {
        communication: action.payload,
        addcommunication: '',
        addcommunicationError: '',
        getcommunication: 'success',
        getcommunicationError: ''
      };
    },
    [Readcommunication.rejected]: (state, action) => {
      return {
        ...state,
        addcommunication: '',
        addcommunicationError: '',
        getcommunication: 'rejected',
        getcommunicationError: action.payload
      };
    },
    [Ajoutercommunication.pending]: (state, action) => {
      return {
        ...state,
        addcommunication: 'pending',
        addcommunicationError: '',
        getcommunication: '',
        getcommunicationError: ''
      };
    },
    [Ajoutercommunication.fulfilled]: (state, action) => {
      return {
        ...state,
        communication: [action.payload, ...state.communication],
        addcommunication: 'success',
        addcommunicationError: '',
        getcommunication: '',
        getcommunicationError: ''
      };
    },
    [Ajoutercommunication.rejected]: (state, action) => {
      return {
        ...state,
        addcommunication: 'rejected',
        addcommunicationError: action.payload,
        getcommunication: '',
        getcommunicationError: ''
      };
    }
  }
});

export default zone.reducer;
