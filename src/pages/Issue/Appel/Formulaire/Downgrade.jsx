import { Button, TextField } from '@mui/material';
import { message } from 'antd';
import axios from 'axios';
import { CreateContexteGlobal } from 'GlobalContext';
import React from 'react';
import { config, lien_issue } from 'static/Lien';
import { CreateContexteTable } from '../Contexte';

function Downgrade() {
  const { item, plainteSelect, initiale, annuler, shopSelect, codeclient } = React.useContext(CreateContexteTable);
  const [autre, setAutres] = React.useState();
  const [sending, setSending] = React.useState(false);
  const { client, setClient } = React.useContext(CreateContexteGlobal);

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
        num_synchro: autre?.num_synchro,
        kit: autre?.kit
      };
      const response = await axios.post(lien_issue + '/downgrade', data, config);
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
          onChange={(e) =>
            setAutres({
              ...autre,
              kit: e.target.value
            })
          }
          name="kit"
          autoComplete="off"
          fullWidth
          label="kit downgradé"
        />
      </div>
      <div style={{ margin: '10px 0px' }}>
        <TextField
          onChange={(e) =>
            setAutres({
              ...autre,
              num_synchro: e.target.value
            })
          }
          name="num"
          autoComplete="off"
          fullWidth
          label="numéro synchro"
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

export default Downgrade;
