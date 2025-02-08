import { Button, TextField } from '@mui/material';
import { message } from 'antd';
import axios from 'axios';
import { CreateContexteGlobal } from 'GlobalContext';
import React from 'react';
import { config, lien_issue } from 'static/Lien';
import { CreateContexteTable } from '../Contexte';

function Desangagement() {
  const { item, plainteSelect, state, annuler, initiale, shopSelect } = React.useContext(CreateContexteTable);
  const { client, setClient } = React.useContext(CreateContexteGlobal);
  const [file, setImage] = React.useState();
  const [raison, setRaison] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    messageApi.open({
      type,
      content: '' + texte,
      duration: 10
    });
  };
  const sendData = async (e) => {
    e.preventDefault();
    try {
      setSending(true);
      const datas = new FormData();
      datas.append('raison', raison);
      datas.append('codeclient', state.codeclient);
      datas.append('shop', shopSelect?.shop);
      datas.append('property', 'shop');
      datas.append('contact', state?.contact);
      datas.append('nomClient', initiale?.nomClient);
      datas.append('plainteSelect', plainteSelect?.title);
      datas.append('typePlainte', item?.title);
      datas.append('file', file);
      const response = await axios.post(lien_issue + '/desengagement', datas, config);
      if (response.status === 200) {
        success('Done', 'success');
        setClient([...client, response.data]);
        setSending(false);
        annuler();
      }
      if (response.status === 201) {
        success('' + response.data, 'error');
        setSending(false);
      }
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        success(error.message, 'error');
      }
    }
  };

  return (
    <div>
      {contextHolder}
      <div>
        <TextField
          onChange={(e) => setRaison(e.target.value)}
          style={{ marginTop: '10px' }}
          name="contact"
          autoComplete="off"
          fullWidth
          label="Raison de désengagement"
        />
      </div>
      <div style={{ margin: '10px 0px' }} className="click">
        <input
          type="file"
          id="actual-btn"
          accept=".pdf"
          hidden
          onChange={(event) => {
            const file = event.target.files[0];
            setImage(file);
          }}
        />
        <label className="label" htmlFor="actual-btn">
          {file?.name ? file?.name : 'Clic here to choose file (contrat)'}
        </label>
      </div>

      <div style={{ marginTop: '10px' }}>
        <Button disabled={sending} onClick={(e) => sendData(e)} color="primary" fullWidth variant="contained">
          Escalader_vers_le_Backoffice
        </Button>
      </div>
    </div>
  );
}

export default Desangagement;
