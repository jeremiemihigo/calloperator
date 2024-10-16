import { Button, TextField } from '@mui/material';
import { message } from 'antd';
import axios from 'axios';
import React from 'react';
import { config, lien } from 'static/Lien';

function WhyToDelete({ id }) {
  const [raison, setRaison] = React.useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    messageApi.open({
      type,
      content: texte,
      duration: 5
    });
  };
  const functDelete = async () => {
    try {
      const response = await axios.post(lien + '/deletedemande', { message: raison, id: id.idDemande }, config);
      if (response.status === 200) {
        success('Done', 'success');
        setRaison('');
      } else {
        success('' + response.data, 'error');
      }
    } catch (error) {
      success('' + error, 'error');
    }
  };
  return (
    <div style={{ width: '20rem' }}>
      {contextHolder}
      <div style={{ marginTop: '10px' }}>
        <TextField
          value={raison}
          fullWidth
          onChange={(e) => setRaison(e.target.value)}
          label="Raison"
          id="raison"
          type="text"
          name="raison"
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <Button fullWidth onClick={() => functDelete()} variant="contained" color="primary">
          Valider
        </Button>
      </div>
    </div>
  );
}

export default WhyToDelete;
