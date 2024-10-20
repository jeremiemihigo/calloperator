import { Button, TextField } from '@mui/material';
import { message } from 'antd';
import axios from 'axios';
import { CreateContexteGlobal } from 'GlobalContext';
import React from 'react';
import { config, lien_issue } from 'static/Lien';
import { CreateContexteTable } from '../Contexte';

function Repossession() {
  const { item, plainteSelect, annuler, initiale, shopSelect, codeclient } = React.useContext(CreateContexteTable);
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
        statut: 'escalade',
        num_synchro: autre?.num_synchro,
        materiel: autre?.materiel,
        raison: autre?.raison
      };
      const response = await axios.post(lien_issue + '/repo_volontaire', data, config);
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
              num_synchro: e.target.value
            })
          }
          name="num_synchro"
          autoComplete="off"
          fullWidth
          label="Num_synchro"
        />
      </div>
      <div style={{ margin: '10px 0px' }}>
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
          label="Materiels manquants"
        />
      </div>
      <div>
        <TextField
          onChange={(e) =>
            setAutres({
              ...autre,
              raison: e.target.value
            })
          }
          name="raison"
          autoComplete="off"
          fullWidth
          label="raison"
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

export default Repossession;
