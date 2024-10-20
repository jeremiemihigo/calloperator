import { Button, TextField } from '@mui/material';
import { message } from 'antd';
import axios from 'axios';
import { CreateContexteGlobal } from 'GlobalContext';
import React from 'react';
import { config, lien_issue } from 'static/Lien';
import { CreateContexteTable } from '../Contexte';

function Regularisation() {
  const { item, plainteSelect, annuler, initiale, shopSelect, codeclient } = React.useContext(CreateContexteTable);
  const [autres, setAutres] = React.useState();
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
        jours: autres?.jours,
        statut: 'escalade',
        cu: autres?.cu,
        date_coupure: autres?.date_coupure,
        raison: autres?.raison
      };
      const response = await axios.post(lien_issue + '/regularisation', data, config);
      if (response.status === 200) {
        success('Done', 'success');
        setClient([response.data, ...client]);
        setSending(false);
        annuler();
      }
      if (response.status === 2001) {
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
          style={{ marginTop: '10px' }}
          name="jours"
          type="number"
          autoComplete="off"
          onChange={(e) =>
            setAutres({
              ...autres,
              jours: e.target.value
            })
          }
          fullWidth
          label="Nombre de jours non consommés"
        />
      </div>
      <div style={{ margin: '10px 0px' }}>
        <TextField
          style={{ marginTop: '10px' }}
          name="cu"
          autoComplete="off"
          onChange={(e) =>
            setAutres({
              ...autres,
              cu: e.target.value
            })
          }
          fullWidth
          label="Numéro du CU"
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <TextField
          style={{ marginTop: '10px' }}
          name="date_coupure"
          autoComplete="off"
          onChange={(e) =>
            setAutres({
              ...autres,
              date_coupure: e.target.value
            })
          }
          fullWidth
          type="date"
          label="Date de coupure"
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <TextField
          style={{ marginTop: '10px' }}
          name="raison"
          autoComplete="off"
          onChange={(e) =>
            setAutres({
              ...autres,
              raison: e.target.value
            })
          }
          fullWidth
          type="text"
          label="Raison"
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

export default Regularisation;
