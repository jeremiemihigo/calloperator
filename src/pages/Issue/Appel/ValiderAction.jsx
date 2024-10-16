import { Button, TextField } from '@mui/material';
import { message } from 'antd';
import axios from 'axios';
import { CreateContexteGlobal } from 'GlobalContext';
import PropType from 'prop-types';
import React from 'react';
import { config, lien_issue } from 'static/Lien';
import Selected from 'static/Select';

function ValiderAction({ clients }) {
  const stat = [
    { id: 1, title: 'Resolved', value: 'resolved' },
    { id: 2, title: 'Not Resolved', value: 'Open_technician_visit' }
  ];
  const [value, setValue] = React.useState('');
  const [commentaire, setCommentaire] = React.useState('');
  const { client, setClient } = React.useContext(CreateContexteGlobal);

  const [sending, setSending] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    messageApi.open({
      type,
      content: '' + texte,
      duration: 5
    });
  };
  const Valider = async (e) => {
    e.preventDefault();
    try {
      setSending(true);
      const data = {
        num_ticket: clients?.idPlainte,
        statut: value,
        commentaire,
        open: value === 'resolved' ? false : true
      };
      const response = await axios.post(`${lien_issue}/verification_ticket`, data, config);
      if (response.status === 200) {
        if (response.data.statut === 'resolved') {
          success('You can only refresh the page', 'success');
        } else {
          let newclient = client.map((x) => (x._id === response.data._id ? response.data : x));
          setClient(newclient);
        }
        setCommentaire('');
        setValue('');
        setSending(false);
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
      <div style={{ marginTop: '5px' }}>
        <Selected label="Statut" data={stat} value={value} setValue={setValue} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <TextField
          onChange={(e) => setCommentaire(e.target.value)}
          value={commentaire}
          style={{ marginTop: '10px' }}
          name="commentaire"
          autoComplete="off"
          fullWidth
          label="commentaire"
        />
      </div>
      <div>
        <Button disabled={sending} onClick={(e) => Valider(e)} variant="contained" color="primary" fullWidth>
          Next
        </Button>
      </div>
    </div>
  );
}
ValiderAction.propTypes = {
  clients: PropType.object,
  close: PropType.func
};
export default React.memo(ValiderAction);
