import { Button, TextField } from '@mui/material';
import { message } from 'antd';
import axios from 'axios';
import { CreateContexteGlobal } from 'GlobalContext';
import React from 'react';
import { config, lien_issue } from 'static/Lien';

function RaisonFermeture({ idPlainte }) {
  const { client, setClient } = React.useContext(CreateContexteGlobal);
  const [value, setValue] = React.useState('');
  React.useEffect(() => {
    setValue('');
  }, [idPlainte]);
  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    messageApi.open({
      type,
      content: '' + texte,
      duration: 5
    });
  };
  const [send, setSend] = React.useState(false);
  const sendData = async (e) => {
    try {
      e.preventDefault();
      setSend(true);
      const response = await axios.post(lien_issue + '/fermeture_plainte', { idPlainte, raison: value }, config);

      if (response.status === 200) {
        setClient(client.map((x) => (x._id === response.data._id ? response.data : x)));
        success('Done', 'success');
        setSend(false);
        setValue('');
      } else {
        success('' + response.data, 'error');
        setSend(false);
      }
      setSend(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ width: '20rem' }}>
      {contextHolder}
      <div style={{ marginTop: '10px' }}>
        <TextField
          value={value}
          onChange={(e) => setValue(e.target.value)}
          name="raison"
          autoComplete="off"
          fullWidth
          label="Raison de Fermeture"
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <Button disabled={send} onClick={(e) => sendData(e)} fullWidth variant="contained" color="primary">
          Escalader
        </Button>
      </div>
    </div>
  );
}

export default RaisonFermeture;
