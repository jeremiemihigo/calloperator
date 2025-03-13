/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { config, portofolio } from 'static/Lien';

const initialState = {
  projet: [],
  addprojet: '',
  addprojetError: '',
  readprojet: '',
  readprojetError: ''
};
export const ReadProjet = createAsyncThunk('projet/ReadProjet', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(portofolio + '/readProjet', config);
    return response.data;
  } catch (error) {
    if (error) {
      alert(JSON.stringify(error.message));
    }
  }
});
export const AjouterProjet = createAsyncThunk('projet/AjouterProjet', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(portofolio + '/addProjet', data, config);
    return response.data;
  } catch (error) {
    if (error) {
      alert(JSON.stringify(error.message));
    }
  }
});

const projet = createSlice({
  name: 'projet',
  initialState,
  reducers: {},
  extraReducers: {
    [ReadProjet.pending]: (state, action) => {
      return {
        ...state,
        addprojet: '',
        addprojetError: '',
        readprojet: 'pending',
        readprojetError: ''
      };
    },
    [ReadProjet.fulfilled]: (state, action) => {
      return {
        projet: action.payload,
        addprojet: '',
        addprojetError: '',
        readprojet: 'success',
        readprojetError: ''
      };
    },
    [ReadProjet.rejected]: (state, action) => {
      return {
        ...state,
        addprojet: '',
        addprojetError: '',
        readprojet: 'rejected',
        readprojetError: action.payload
      };
    },
    [AjouterProjet.pending]: (state, action) => {
      return {
        ...state,
        addprojet: 'pending',
        addprojetError: '',
        readprojet: '',
        readprojetError: ''
      };
    },
    [AjouterProjet.fulfilled]: (state, action) => {
      return {
        projet: [action.payload, ...state.projet],
        addprojet: 'success',
        addprojetError: '',
        readprojet: '',
        readprojetError: ''
      };
    },
    [AjouterProjet.rejected]: (state, action) => {
      return {
        ...state,
        addprojet: 'rejected',
        addprojetError: action.payload,
        readprojet: '',
        readprojetError: ''
      };
    }
  }
});

export default projet.reducer;
