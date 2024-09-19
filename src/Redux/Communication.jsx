/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { config, lien } from 'static/Lien';

const initialState = {
  communication: [],
  addcommunication: '',
  addcommunicationError: '',
  getcommunication: '',
  getcommunicationError: '',
  updateCommuniquer: '',
  updateCommuniquerError: '',
  deleteCommuniquer: '',
  deleteCommuniquerError: ''
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
export const UpdateCommunication = createAsyncThunk('communication/UpdateCommunication', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.put(lien + '/communication', data, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
export const DeleteCommunication = createAsyncThunk('communication/DeleteCommunication', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${lien}/communication/${id}`, config);
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
        getcommunicationError: '',
        updateCommuniquer: '',
        updateCommuniquerError: '',
        deleteCommuniquer: '',
        deleteCommuniquerError: ''
      };
    },
    [Readcommunication.fulfilled]: (state, action) => {
      return {
        communication: action.payload,
        addcommunication: '',
        addcommunicationError: '',
        getcommunication: 'success',
        getcommunicationError: '',
        updateCommuniquer: '',
        updateCommuniquerError: '',
        deleteCommuniquer: '',
        deleteCommuniquerError: ''
      };
    },
    [Readcommunication.rejected]: (state, action) => {
      return {
        ...state,
        addcommunication: '',
        addcommunicationError: '',
        getcommunication: 'rejected',
        getcommunicationError: action.payload,
        updateCommuniquer: '',
        updateCommuniquerError: '',
        deleteCommuniquer: '',
        deleteCommuniquerError: ''
      };
    },
    [Ajoutercommunication.pending]: (state, action) => {
      return {
        ...state,
        addcommunication: 'pending',
        addcommunicationError: '',
        getcommunication: '',
        getcommunicationError: '',
        updateCommuniquer: '',
        updateCommuniquerError: '',
        deleteCommuniquer: '',
        deleteCommuniquerError: ''
      };
    },
    [Ajoutercommunication.fulfilled]: (state, action) => {
      return {
        ...state,
        communication: [action.payload, ...state.communication],
        addcommunication: 'success',
        addcommunicationError: '',
        getcommunication: '',
        getcommunicationError: '',
        updateCommuniquer: '',
        updateCommuniquerError: '',
        deleteCommuniquer: '',
        deleteCommuniquerError: ''
      };
    },
    [Ajoutercommunication.rejected]: (state, action) => {
      return {
        ...state,
        addcommunication: 'rejected',
        addcommunicationError: action.payload,
        getcommunication: '',
        getcommunicationError: '',
        updateCommuniquer: '',
        updateCommuniquerError: '',
        deleteCommuniquer: '',
        deleteCommuniquerError: ''
      };
    },
    [UpdateCommunication.pending]: (state, action) => {
      return {
        ...state,
        addcommunication: '',
        addcommunicationError: '',
        getcommunication: '',
        getcommunicationError: '',
        updateCommuniquer: 'pending',
        updateCommuniquerError: '',
        deleteCommuniquer: '',
        deleteCommuniquerError: ''
      };
    },
    [UpdateCommunication.fulfilled]: (state, action) => {
      const newData = state.communication.map((x) => (x._id === action.payload._id ? action.payload : x));
      return {
        communication: newData,
        addcommunication: '',
        addcommunicationError: '',
        getcommunication: '',
        getcommunicationError: '',
        updateCommuniquer: 'success',
        updateCommuniquerError: '',
        deleteCommuniquer: '',
        deleteCommuniquerError: ''
      };
    },
    [UpdateCommunication.rejected]: (state, action) => {
      return {
        ...state,
        addcommunication: '',
        addcommunicationError: '',
        getcommunication: '',
        getcommunicationError: '',
        updateCommuniquer: 'rejected',
        updateCommuniquerError: action.payload,
        deleteCommuniquer: '',
        deleteCommuniquerError: ''
      };
    },
    [DeleteCommunication.pending]: (state, action) => {
      return {
        ...state,
        addcommunication: '',
        addcommunicationError: '',
        getcommunication: '',
        getcommunicationError: '',
        updateCommuniquer: '',
        updateCommuniquerError: '',
        deleteCommuniquer: 'pending',
        deleteCommuniquerError: ''
      };
    },
    [DeleteCommunication.fulfilled]: (state, action) => {
      const newData = state.communication.filter((x) => x._id !== action.payload.id);
      return {
        communication: newData,
        addcommunication: '',
        addcommunicationError: '',
        getcommunication: '',
        getcommunicationError: '',
        updateCommuniquer: '',
        updateCommuniquerError: '',
        deleteCommuniquer: 'success',
        deleteCommuniquerError: ''
      };
    },
    [DeleteCommunication.rejected]: (state, action) => {
      return {
        ...state,
        addcommunication: '',
        addcommunicationError: '',
        getcommunication: '',
        getcommunicationError: '',
        updateCommuniquer: '',
        updateCommuniquerError: '',
        deleteCommuniquer: 'rejected',
        deleteCommuniquerError: action.payload
      };
    }
  }
});

export default zone.reducer;
