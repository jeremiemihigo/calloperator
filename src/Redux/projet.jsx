/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { config, lien_servey } from 'static/Lien';

const initialState = {
  projet: [],
  addProjet: '',
  addProjetError: '',
  readProjet: '',
  readProjetError: ''
};
export const ReadProjet = createAsyncThunk('projet/ReadAgent', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(lien_servey + '/projet', config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
export const AddProjet = createAsyncThunk('projet/AddProjet', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(lien_servey + '/add_projet', data, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const agent = createSlice({
  name: 'projet',
  initialState,
  reducers: {},
  extraReducers: {
    [ReadProjet.pending]: (state, action) => {
      return {
        ...state,
        addProjet: '',
        addProjetError: '',
        readProjet: 'pending',
        readProjetError: ''
      };
    },
    [ReadProjet.fulfilled]: (state, action) => {
      return {
        projet: action.payload,
        addProjet: '',
        addProjetError: '',
        readProjet: 'success',
        readProjetError: ''
      };
    },
    [ReadProjet.rejected]: (state, action) => {
      return {
        ...state,
        addProjet: '',
        addProjetError: '',
        readProjet: 'rejected',
        readProjetError: action.payload
      };
    },
    [AddProjet.pending]: (state, action) => {
      return {
        ...state,
        addProjet: 'pending',
        addProjetError: '',
        readProjet: '',
        readProjetError: ''
      };
    },
    [AddProjet.fulfilled]: (state, action) => {
      return {
        projet: [action.payload, ...state.projet],
        addProjet: 'success',
        addProjetError: '',
        readProjet: '',
        readProjetError: ''
      };
    },
    [AddProjet.rejected]: (state, action) => {
      return {
        ...state,
        addProjet: 'rejected',
        addProjetError: action.payload,
        readProjet: '',
        readProjetError: ''
      };
    }
  }
});

export default agent.reducer;
