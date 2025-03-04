import { Alert, Button, TextField } from '@mui/material';
import axios from 'axios';
import SimpleBackdrop from 'components/Backdrop';
import React from 'react';
import { config, lien_dt } from 'static/Lien';

function Agent({ data, fetchData }) {
  const [codeAgent, setCode] = React.useState('');
  const [message, setMessage] = React.useState({ text: '', type: '' });
  const [sending, setSending] = React.useState(false);
  const { text, type } = message;
  const editAgent = async () => {
    try {
      setSending(true);
      const { codeclient, shop } = data;
      const response = await axios.put(
        lien_dt + '/objectif',
        {
          codeclient,
          shop_client: shop,
          codeAgent
        },
        config
      );
      if (response.status === 200) {
        setMessage({ text: 'Done', type: 'success' });
        setSending(false);
        setCode('');
        fetchData();
      } else {
        setMessage({ text: response.data, type: 'warning' });
        setSending(false);
      }
    } catch (error) {
      setMessage({ text: JSON.stringify(error), type: 'warning' });
      setSending(false);
    }
  };
  return (
    <>
      {sending && <SimpleBackdrop open={sending} title="Please wait..." />}
      <div style={{ padding: '10px', minWidth: '30%' }}>
        <div style={{ marginBottom: '10px' }}>{text && <Alert type={type}>{text}</Alert>}</div>
        <div>
          <TextField
            onChange={(e) => {
              setCode(e.target.value);
              setMessage({ text: '', type: '' });
            }}
            label="Nouveau code Agent"
            fullWidth
            value={codeAgent}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <Button onClick={() => editAgent()} variant="contained" color="primary" fullWidth>
            Valider
          </Button>
        </div>
      </div>
    </>
  );
}

export default Agent;
