import { Button, TextField } from '@mui/material';
import axios from 'axios';
import AutoComplement from 'components/AutoComplete';
import SimpleBackdrop from 'components/Backdrop';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { config, lien_dt } from 'static/Lien';

function ChangeStatus({ client, allclient, setClient, setOpen }) {
  const feedback = useSelector((state) => state.feedback.feedback);
  const [value, setValue] = React.useState('');
  const [commentaire, setCommentaire] = React.useState('');

  const [sending, setSending] = React.useState(false);
  const changeFeedback = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const data = {
        id: client._id,
        lastFeedback: client.idFeedback,
        nextFeedback: value?.idFeedback,
        commentaire
      };
      const response = await axios.post(lien_dt + '/changefeedback', data, config);
      if (response.status === 200) {
        setClient(allclient.filter((x) => x.codeclient !== response.data.codeclient));
        setSending(false);
        setOpen(false);
        setValue('');
        setCommentaire('');
      }
    } catch (error) {}
  };

  return (
    <>
      <SimpleBackdrop open={sending} title="Please wait..." />
      <div style={{ width: '20rem', padding: '10px' }}>
        <p style={{ textAlign: 'center' }}> {client.codeclient}</p>
        <div>
          {feedback && (
            <AutoComplement value={value} setValue={setValue} options={feedback} title="Selectionnez le nouveau feedback" propr="title" />
          )}
        </div>
        <div style={{ margin: '10px 0px' }}>
          <TextField
            onChange={(e) => {
              e.preventDefault();
              setCommentaire(e.target.value);
            }}
            id="outlined-multiline-static"
            label="Commentaire (facultatif)"
            multiline
            rows={5}
            fullWidth
          />
        </div>
        <div>
          <Button onClick={(e) => changeFeedback(e)} color="primary" variant="contained" fullWidth>
            Valider
          </Button>
        </div>
      </div>
    </>
  );
}
ChangeStatus.propTypes = {
  client: PropTypes.object
};
export default React.memo(ChangeStatus);
