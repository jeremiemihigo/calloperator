import { FormControl, InputAdornment, OutlinedInput } from '@mui/material';
import './historique.style.css';
// assets
import { Search } from '@mui/icons-material';
import { Paper } from '@mui/material';
import axios from 'axios';
import SimpleBackdrop from 'components/Backdrop';
import React from 'react';
import { config, lien_dt } from 'static/Lien';
import { Clear } from '@mui/icons-material';
import { Fab } from '@mui/material';
import Affichage from './Affichage';

function Index() {
  const [value, setValue] = React.useState('');
  const [data, setData] = React.useState();
  const [load, setLoad] = React.useState(false);

  const readClient = async (codeclient) => {
    try {
      setLoad(true);
      const response = await axios.get(`${lien_dt}/information/${codeclient}`, config);
      if (response.status === 200) {
        setData(response.data);
        setLoad(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <SimpleBackdrop open={load} title="Chargement..." taille="10rem" />
      {!data && (
        <div className="divHistorique">
          <div>
            <p>Customer code</p>
            <Paper elevation={2}>
              <FormControl sx={{ width: '100%' }}>
                <OutlinedInput
                  size="small"
                  onKeyUp={(e) => e.keyCode === 13 && readClient(e.target.value)}
                  id="header-search"
                  className="inputclasse"
                  startAdornment={
                    <InputAdornment position="start" sx={{ mr: 2 }}>
                      <Search />
                    </InputAdornment>
                  }
                  aria-describedby="header-search-text"
                  inputProps={{
                    'aria-label': 'weight'
                  }}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder=""
                />
              </FormControl>
            </Paper>
          </div>
        </div>
      )}

      {data && (
        <Fab
          color="primary"
          sx={{ marginBottom: '15px' }}
          variant="contained"
          size="small"
          onClick={() => {
            setData();
            setValue('');
          }}
        >
          <Clear fontSize="small" />
        </Fab>
      )}

      {data && <Affichage data={data} />}
    </>
  );
}

export default Index;
