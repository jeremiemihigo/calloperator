import { Save } from '@mui/icons-material';
import { Button } from '@mui/material';
import axios from 'axios';
import AutoComplement from 'components/AutoComplete';
import DirectionSnackbar from 'components/Direction';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, lien_dt } from 'static/Lien';

function ChangeCurrent({ client, property, loadingData, setOpen }) {
  const feedback = useSelector((state) => state.feedback.feedback);
  const [feedselect, setFeedselect] = React.useState('');
  const [message, setMessage] = React.useState({ load: false, message: '' });
  const sendData = async (event) => {
    event.preventDefault();
    try {
      setMessage({ load: true, message: '' });
      const response = await axios.post(
        `${lien_dt}/changeStatusOnly`,
        {
          id: client.id,
          data: {
            [property]: feedselect?.idFeedback
          }
        },
        config
      );
      if (response.status === 200) {
        setFeedselect('');
        loadingData();
        setOpen(false);
        setMessage({ load: false, message: 'Done' });
      }
      if (response.status === 201) {
        setMessage({ load: false, message: response.data });
      }
    } catch (error) {
      setMessage({ load: false, message: error.message });
    }
  };
  return (
    <div style={{ padding: '10px', minWidth: '20rem' }}>
      {message.message && <DirectionSnackbar message={message.message} />}
      {feedback && (
        <AutoComplement value={feedselect} setValue={setFeedselect} options={feedback} title="New current Feedback" propr="title" />
      )}
      <div style={{ marginTop: '10px' }}>
        <Button disabled={message.load} onClick={(e) => sendData(e)} fullWidth color="primary" variant="contained">
          <Save fontSize="small" /> <span>Valider</span>
        </Button>
      </div>
    </div>
  );
}

export default ChangeCurrent;
