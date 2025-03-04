import { Alert, Button, TextField } from '@mui/material';
import axios from 'axios';
import SimpleBackdrop from 'components/Backdrop';
import React from 'react';
import { config, lien_dt } from 'static/Lien';

function VisiteMenage({ data, fetchData }) {
  const [new_feedback, setNewFeedback] = React.useState('');
  const [message, setMessage] = React.useState({ text: '', type: '' });
  const [sending, setSending] = React.useState(false);
  const { text, type } = message;
  const editAgent = async () => {
    try {
      setSending(true);
      const { codeclient } = data;
      const response = await axios.put(
        lien_dt + '/edit_feeback_vm',
        {
          codeclient,
          new_feedback
        },
        config
      );
      if (response.status === 200) {
        setMessage({ text: 'Done', type: 'success' });
        setSending(false);
        setNewFeedback('');
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
              setNewFeedback(e.target.value);
              setMessage({ text: '', type: '' });
            }}
            label="New feeback"
            value={new_feedback}
            fullWidth
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

export default VisiteMenage;
