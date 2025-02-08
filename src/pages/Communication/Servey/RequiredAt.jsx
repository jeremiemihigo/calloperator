import { Alert, Button, TextField } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { config, lien_terrain } from 'static/Lien';
import { Grid } from '../../../../node_modules/@mui/material/index';

function RequiredAt({ id }) {
  const [initiale, setInitiale] = React.useState({ debut: '', fin: '' });
  const { debut, fin } = initiale;
  const [message, setMessage] = React.useState('');
  const sendData = async () => {
    try {
      const response = await axios.post(
        lien_terrain + '/requiredAt',
        {
          id,
          debut,
          fin
        },
        config
      );
      if (response.status === 200) {
        setMessage('Done');
      } else {
        setMessage(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Grid container style={{ minWidth: '20rem', padding: '10px' }}>
        {message && <Alert type="success">{message}</Alert>}
        <Grid item lg={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span>De</span>
        </Grid>
        <Grid item lg={5}>
          <TextField
            name="debut"
            id="outlined-multiline-static"
            type="time"
            label="Debut"
            onChange={(e) =>
              setInitiale({
                ...initiale,
                debut: e.target.value
              })
            }
            fullWidth
          />
        </Grid>
        <Grid item lg={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          à
        </Grid>
        <Grid item lg={5}>
          <TextField
            name="Fin"
            type="time"
            id="outlined-multiline-static"
            label="Fin"
            onChange={(e) =>
              setInitiale({
                ...initiale,
                fin: e.target.value
              })
            }
            fullWidth
          />
        </Grid>
      </Grid>
      <div style={{ marginTop: '10px' }}>
        <Button onClick={() => sendData()} variant="contained" color="primary" fullWidth>
          Submit
        </Button>
      </div>
    </>
  );
}

export default RequiredAt;
