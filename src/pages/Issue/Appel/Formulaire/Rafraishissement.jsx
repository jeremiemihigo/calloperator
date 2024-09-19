import { Button, TextField } from '@mui/material';
import { message } from 'antd';
import axios from 'axios';
import { CreateContexteGlobal } from 'GlobalContext';
import React from 'react';
import { config, lien_issue } from 'static/Lien';
import { CreateContexteTable } from '../Contexte';

function Rafraichissement() {
  const { item, plainteSelect, initiale, annuler, shopSelect, codeclient } = React.useContext(CreateContexteTable);
  const [sending, setSending] = React.useState(false);
  const { client, setClient } = React.useContext(CreateContexteGlobal);

  const [value, setValue] = React.useState('');

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

      const data = {
        codeclient,
        shop: shopSelect?.shop,
        property: 'shop',
        contact: initiale?.contact,
        nomClient: initiale?.nomClient,
        plainteSelect: plainteSelect?.title,
        typePlainte: item?.title,
        decodeur: value,
        type: 'support',
        operation: 'backoffice'
      };
      const response = await axios.post(lien_issue + '/addplainte_support', data, config);
      if (response.status === 200) {
        success('Done', 'success');
        setClient([response.data, ...client]);
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
        setSending(false);
      }
    }
  };
  return (
    <div style={{ width: '20rem' }}>
      {contextHolder}
      <div style={{ marginTop: '10px' }}>
        <TextField
          onChange={(e) => setValue(e.target.value)}
          name="rafraichissement"
          autoComplete="off"
          value={value}
          fullWidth
          label="Numero decodeur"
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <Button disabled={sending} onClick={(e) => sendData(e)} color="primary" fullWidth variant="contained">
          Escalader_vers_le_Backoffice
        </Button>
      </div>
    </div>
  );
}

export default Rafraichissement;
