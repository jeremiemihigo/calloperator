import { Button, TextField } from '@mui/material';
import { message } from 'antd';
import { CreateContexteGlobal } from 'GlobalContext';
import React from 'react';
import { config, lien_issue } from 'static/Lien';
import axios from '../../../../../node_modules/axios/index';
import { CreateContexteTable } from '../Contexte';

function Upgrade() {
  const { item, plainteSelect, annuler, initiale, shopSelect, codeclient } = React.useContext(CreateContexteTable);
  const [autre, setAutres] = React.useState();
  const { client, setClient } = React.useContext(CreateContexteGlobal);

  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    messageApi.open({
      type,
      content: '' + texte,
      duration: 10
    });
  };
  const [sending, setSending] = React.useState(false);
  const sendData = async (e) => {
    try {
      e.preventDefault();
      setSending(true);

      const data = {
        codeclient,
        shop: shopSelect?.shop,
        property: 'shop',
        contact: initiale?.contact,
        nomClient: initiale?.nomClient,
        statut: 'escalade',
        plainteSelect: plainteSelect?.title,
        typePlainte: item?.title,
        materiel: autre?.materiel
      };
      const response = await axios.post(lien_issue + '/upgrade', data, config);
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
      <div>
        <TextField
          onChange={(e) =>
            setAutres({
              ...autre,
              materiel: e.target.value
            })
          }
          name="materiel"
          autoComplete="off"
          fullWidth
          label="Matériel à upgrader"
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

export default Upgrade;
