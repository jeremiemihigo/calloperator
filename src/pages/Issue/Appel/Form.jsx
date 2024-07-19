import { Button, TextField } from '@mui/material';
import AutoComplement from 'Control/AutoComplet';
import { message } from 'antd';
import axios from 'axios';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, lien_issue } from 'static/Lien';

function Form({ setCodeclient, codeclient, setTime, setDonner }) {
  const [initiale, setInitiale] = React.useState({
    codeclient: '',
    recommandation: '',
    nomClient: ''
  });
  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    navigator.clipboard.writeText(texte);
    messageApi.open({
      type: type,
      content: texte,
      duration: 2
    });
  };
  const plainte = useSelector((state) => state.plainte.plainte);
  const [item, setItem] = React.useState('');
  const [plainteSelect, setPlainteSelect] = React.useState('');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInitiale({
      ...initiale,
      [name]: value
    });
    if (name === 'codeclient') {
      setCodeclient(value);
    }
  };
  const sendAppel = async (e) => {
    e.preventDefault();
    const data = {
      codeclient: codeclient,
      idPlainte: localStorage.getItem('idPlainte'),
      typePlainte: plainteSelect?.title,
      plainteSelect: item?.title,
      recommandation: initiale.recommandation,
      nomClient: initiale.nomClient
    };
    const response = await axios.post(lien_issue + '/appel', data, config);
    if (response.status === 200) {
      setTime(0);
      localStorage.removeItem('statut');
      localStorage.removeItem('fullDateSave');
      localStorage.removeItem('idPlainte');
      localStorage.removeItem('codeclient');
      setInitiale({
        codeclient: '',
        recommandation: '',
        nomClient: ''
      });
      setDonner({
        fullDateSave: '',
        idPlainte: '',
        statut: ''
      });
      setItem('');
      setPlainteSelect('');
      success('Done', 'success');
    } else {
      success('' + response.data, 'error');
    }
    console.log(response);
  };
  return (
    <div>
      {contextHolder}

      <div style={{ marginBottom: '10px' }}>
        <TextField
          onChange={(e) => handleChange(e)}
          value={initiale.nomClient}
          style={{ marginTop: '10px' }}
          name="nomClient"
          autoComplete="off"
          fullWidth
          label="customer name"
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        {plainte && <AutoComplement value={plainteSelect} setValue={setPlainteSelect} options={plainte} title="Plainte" propr="title" />}
      </div>
      <div style={{ marginBottom: '10px' }}>
        {plainteSelect && (
          <AutoComplement value={item} setValue={setItem} options={plainteSelect?.alltype} title="Probleme" propr="title" />
        )}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <TextField
          onChange={(e) => handleChange(e)}
          value={initiale.recommandation}
          style={{ marginTop: '10px' }}
          name="recommandation"
          autoComplete="off"
          fullWidth
          label="Recommandation"
        />
      </div>
      <div>
        <Button onClick={(e) => sendAppel(e)} color="primary" variant="contained">
          Cloturer la plainte
        </Button>
      </div>
    </div>
  );
}

export default Form;
