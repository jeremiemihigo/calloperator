import { Button, TextField } from '@mui/material';
import { message } from 'antd';
import axios from 'axios';
import SimpleBackdrop from 'components/Backdrop';
import Selected from 'components/Select';
import React from 'react';
import { config, lien_dt } from 'static/Lien';

function AddAction({ data, fetchData }) {
  const { codeclient, action, id } = data;

  const [valueSelect, setValueSelect] = React.useState('');
  const [commentaire, setComment] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const selection = [
    { id: 1, title: 'Approved', value: 'Approved' },
    { id: 2, title: 'Rejected', value: 'Rejected' }
  ];
  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    navigator.clipboard.writeText(texte);
    messageApi.open({
      type: '' + type,
      content: '' + texte,
      duration: 2
    });
  };
  const sendAction = async () => {
    try {
      setSending(true);
      const response = await axios.post(
        lien_dt + '/valideraction',
        {
          id,
          last_statut: action,
          next_statut: valueSelect,
          commentaire
        },
        config
      );
      if (response.status === 200) {
        success('Done ' + codeclient, 'success');
        setSending(false);
        setValueSelect('');
        setComment('');
        fetchData();
      } else {
        success('' + JSON.stringify(response.data), 'warning');
        setSending(false);
      }
    } catch (error) {
      success('' + JSON.stringify(error.message), 'warning');
      setSending(false);
    }
  };
  return (
    <div style={{ minWidth: '20rem', padding: '10px' }}>
      {contextHolder}
      <SimpleBackdrop open={sending} title="Please wait..." taille="10rem" />
      <div>
        <Selected label="Type" data={selection} value={valueSelect} setValue={setValueSelect} />
      </div>
      <div style={{ margin: '10px 0px' }}>
        <TextField onChange={(e) => setComment(e.target.value)} value={commentaire} fullWidth label="Commentaire" id="Commentaire" />
      </div>
      <div>
        <Button onClick={() => sendAction()} fullWidth color="primary" variant="contained">
          Valider
        </Button>
      </div>
    </div>
  );
}

export default AddAction;
