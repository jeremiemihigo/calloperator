/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { lien, config } from 'static/Lien';

const initialState = {
demande : [],
readDemande :"",
readDemandeError:""
};
export const ReadDemande = createAsyncThunk('demande/ReadDemande', async (id, { rejectWithValue }) => {
  try {
   
    const response = await axios.get(lien + '/toutesDemandeAttente', config);
    return response.data.response;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});


const demande = createSlice({
  name: 'demande',
  initialState,
  reducers: {},
  extraReducers: {
    [ReadDemande.pending]: (state, action) => {
      return {
        ...state,
        readDemande :"pending",
        readDemandeError:""
      };
    },
    [ReadDemande.fulfilled]: (state, action) => {
      return {
        ...state,
        demande : action.payload,
        readDemande :"success",
        readDemandeError:""
      };
    },
    [ReadDemande.rejected]: (state, action) => {
      return {
        ...state,
        readDemande :"rejected",
        readDemandeError:action.payload
      };
    },
  }
});

export default demande.reducer;
