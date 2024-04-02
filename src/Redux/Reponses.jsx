/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { lien } from 'static/Lien';
const initialState = {
  reponse: [],
  getReponse: '',
  getReponseError: '',
  postDemande: '',
  postDemandeError: '',
  postId: ''
};
const config = {
  headers: {
    'Content-Type': 'Application/json',
    Authorization: 'Bearer ' + localStorage.getItem('auth')
  }
};
export const ReadReponse = createAsyncThunk('reponse/ReadReponse', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.get(lien + '/touteDemande', config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
export const postReponse = createAsyncThunk('reponse/postDemande', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(lien + '/reponsedemande', data, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const reponse = createSlice({
  name: 'reponse',
  initialState,
  reducers: {},
  extraReducers: {
    [ReadReponse.pending]: (state, action) => {
      return {
        ...state,
        getReponse: 'pending',
        getReponseError: '',
        postDemande: '',
        postDemandeError: '',
        postId: ''
      };
    },

    [ReadReponse.fulfilled]: (state, action) => {
      return {
        reponse: action.payload,
        getReponse: 'success',
        getReponseError: '',
        postDemande: '',
        postDemandeError: '',
        postId: ''
      };
    },
    [ReadReponse.rejected]: (state, action) => {
      return {
        ...state,
        getReponse: 'rejected',
        getReponseError: action.payload,
        postDemande: '',
        postDemandeError: '',
        postId: ''
      };
    },
    [postReponse.pending]: (state, action) => {
      return {
        ...state,
        getReponse: '',
        getReponseError: '',
        postDemande: 'pending',
        postDemandeError: '',
        postId: ''
      };
    },
    [postReponse.fulfilled]: (state, action) => {
      return {
        ...state,
        getReponse: '',
        getReponseError: '',
        postDemande: 'success',
        postId: action.payload,
        postDemandeError: ''
      };
    },
    [postReponse.rejected]: (state, action) => {
      return {
        ...state,
        getReponse: '',
        getReponseError: '',
        postDemande: 'rejected',
        postDemandeError: action.payload,
        postId: ''
      };
    }
  }
});

export default reponse.reducer;
