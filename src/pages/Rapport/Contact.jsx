import { Button, Grid, Paper, Typography } from '@mui/material';
import axios from 'axios';
import Input from 'components/Input';
import moment from 'moment';
import React from 'react';
import { config, lien } from 'static/Lien';
import './style.css';

function Contact() {
  const [value, setValue] = React.useState('');
  const [data, setData] = React.useState();
  const [chargement, setChargement] = React.useState(false);
  const loading = async (e) => {
    setChargement(true);
    setData();
    e.preventDefault();
    const response = await axios.post(lien + '/contact', { codeclient: value }, config);
    setChargement(false);
    if (response.status === 200) {
      setData(response.data);
    }
  };
  return (
    <>
      <Grid container>
        <Grid item lg={8} md={8} sm={8} xs={8}>
          <Input label="code client" setValue={setValue} value={value} showIcon={true} />
        </Grid>
        <Grid item lg={4} md={4} sm={4} xs={4} sx={{ paddingLeft: '10px' }}>
          <Button disabled={chargement} color="primary" variant="contained" onClick={(e) => loading(e)}>
            Recherche
          </Button>
        </Grid>
      </Grid>
      {chargement && <p style={{ margin: '10px', textAlign: 'center' }}>Chargement...</p>}
      {data && data.length === 0 && (
        <p style={{ textAlign: 'center', color: 'red', fontWeight: 'bolder', margin: '10px' }}>No number found</p>
      )}
      <Grid container sx={{ marginTop: '15px' }}>
        {data &&
          data.length > 0 &&
          data.map((index, key) => {
            return (
              <Grid item lg={3} md={4} sm={4} xs={6} key={key} sx={{ padding: '5px' }}>
                <Paper elevation={4} className="paperNumero">
                  <p className="origin">Origin {index.provenance}</p>
                  <Typography component="p" noWrap className="number">
                    {index.numero}
                  </Typography>
                  <p className="registre">Registration Date: {moment(index.date).format('DD/MM/YYYY hh:mm')}</p>
                  <p className="registre">{moment(index.date).fromNow()}</p>
                </Paper>
              </Grid>
            );
          })}
      </Grid>
    </>
  );
}

export default Contact;
