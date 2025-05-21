import { Button, TextField } from '@mui/material';
import axios from 'axios';
import SimpleBackdrop from 'components/Backdrop';
import React from 'react';
import { config, lien_dt } from 'static/Lien';

function Formulaire({ client, data, setData }) {
  const [feedback, setFeedback] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const sendData = async (statut) => {
    try {
      setSending(true);
      const response = await axios.post(
        lien_dt + '/arbitrage',
        {
          id: client.id,
          current_status: client.currentfeedback,
          changeto: client.changeto.length === 0 ? client.appel[0] : client.changeto[0],
          submitedBy: client.changeto.length === 0 ? 'Automatique' : client.submitedBy,
          commentaire: feedback,
          feedback: statut
        },
        config
      );
      if (response.status === 200) {
        setData(data.filter((x) => x.id !== client.id));
        setMessage('Done');
        setSending(false);
        setFeedback('');
      } else {
        setMessage(JSON.stringify(response.data));
        setSending(false);
      }
    } catch (error) {
      setMessage(JSON.stringify(error.message));
      setSending(false);
    }
  };
  React.useEffect(() => {
    setFeedback('');
    setMessage('');
  }, [client]);
  return (
    <div style={{ width: '20rem', padding: '10px' }}>
      <SimpleBackdrop open={sending} title="Please wait..." />
      {message && <p style={{ textAlign: 'center', fontSize: '12px', marginBottom: '12px' }}>{message}</p>}
      <div>
        <TextField value={feedback} onChange={(e) => setFeedback(e.target.value)} fullWidth multiline row={5} label="Raison" />
      </div>
      <div style={{ marginTop: '10px', display: 'flex' }}>
        <div style={{ padding: '5px', width: '50%' }}>
          <Button onClick={() => sendData('Approved')} color="success" variant="contained" fullWidth>
            Done
          </Button>
        </div>
        <div style={{ padding: '5px', width: '50%' }}>
          <Button onClick={() => sendData('Rejected')} color="warning" variant="contained" fullWidth>
            Rejected
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Formulaire;
