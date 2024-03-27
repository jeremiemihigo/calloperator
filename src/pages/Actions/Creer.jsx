/* eslint-disable react/prop-types */
import React from 'react';
import { Input, Button } from 'antd';
import { Grid } from '@mui/material';
import axios from 'axios';
import { lien } from 'static/Lien';

function Creer({ client }) {
  const [loadings, setLoadings] = React.useState([]);
  const [text, setText] = React.useState('');
  //idReponse, text, action
  const enterLoading = async (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    const response = await axios.post(lien + '/action', { idReponse: client._id, text });
    console.log(response);
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 3000);
  };
  return (
    <div>
      <p>demander l&apos;action</p>
      {client ? (
        <>
          <Grid sx={{ marginBottom: '12px' }}>
            <Input onChange={(e) => setText(e.target.value)} placeholder={`Concerne ${client.nomClient}`} />
          </Grid>
          <Button type="primary" loading={loadings[0]} onClick={() => enterLoading(0)}>
            Envoyer
          </Button>
        </>
      ) : (
        <p style={{ textAlign: 'center', color: 'red' }}>Selectionnez le client</p>
      )}
    </div>
  );
}

export default Creer;
