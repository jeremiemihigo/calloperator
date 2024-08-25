import { Save } from '@mui/icons-material';
import { Button, Checkbox, TextField, Typography } from '@mui/material';
import { message } from 'antd';
import axios from 'axios';
import AutoComplement from 'Control/AutoComplet';
import { CreateContexteGlobal } from 'GlobalContext';
import React from 'react';
import { config, lien_issue, returnDelai, sat } from 'static/Lien';
import { CreateContexteTable } from '../Contexte';

function InfoClient() {
  const [select, setSelect] = React.useState('');
  const [satSelect, setSatSelect] = React.useState('');
  const [init, setInitiale] = React.useState();
  const { item, plainteSelect, annuler, initiale, shopSelect, codeclient } = React.useContext(CreateContexteTable);
  const { client, setClient } = React.useContext(CreateContexteGlobal);
  const [today, setToday] = React.useState({
    datetime: new Date(),
    day_of_week: new Date().getDay()
  });
  const loading = async () => {
    try {
      const date = await axios.get('https://worldtimeapi.org/api/timezone/Africa/Lubumbashi');
      setToday(date.data);
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loading();
  }, [initiale]);

  const handlechange = (event) => {
    const { name, value } = event.target;
    setInitiale({
      ...init,
      [name]: value
    });
  };
  const changeOption = (value) => {
    setInitiale('');
    setSelect(value);
  };

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
      const delai = await returnDelai('escalade', today.datetime);
      const data = {
        codeclient,
        shop: shopSelect?.shop,
        property: 'shop',
        contact: initiale?.contact,
        nomClient: initiale?.nomClient,
        plainteSelect: plainteSelect?.title,
        typePlainte: item?.title,
        time_delai: delai,
        adresse: init,
        fullDate: today.datetime
      };
      const response = await axios.post(lien_issue + '/info_client', data, config);
      if (response.status === 200) {
        setClient([response.data, ...client]);
        annuler();
      } else {
        success('' + response.data, 'error');
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div style={{ width: '25rem' }}>
      {contextHolder}
      <div style={{ display: 'flex' }}>
        <Typography onClick={() => changeOption('contact')} component="span" style={{ cursor: 'pointer' }}>
          <Checkbox checked={select == 'contact' ? true : false} />
          <label htmlFor="contact">Contact</label>
        </Typography>
        <Typography onClick={() => changeOption('adresse')} component="span" style={{ cursor: 'pointer', marginLeft: '20px' }}>
          <Checkbox checked={select == 'adresse' ? true : false} />
          <label htmlFor="adresse">Adresses</label>
        </Typography>
      </div>
      {select === 'contact' && (
        <>
          <div style={{ marginTop: '10px' }}>
            <TextField onChange={(e) => handlechange(e)} name="contact" autoComplete="off" fullWidth label="Customer Contact" />
          </div>
          <div style={{ marginTop: '10px' }}>
            <Button onClick={(e) => sendData(e)} fullWidth variant="contained" color="primary">
              <Save fontSize="small" /> <span style={{ marginLeft: '10px' }}>Escalader</span>
            </Button>
          </div>
        </>
      )}
      {select === 'adresse' && (
        <>
          <div style={{ marginBottom: '10px' }}>
            <TextField
              onChange={(e) => handlechange(e)}
              style={{ marginTop: '10px' }}
              name="commune"
              autoComplete="off"
              fullWidth
              label="Commune"
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <TextField
              onChange={(e) => handlechange(e)}
              style={{ marginTop: '10px' }}
              name="quartier"
              autoComplete="off"
              fullWidth
              label="Quartier"
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <TextField
              onChange={(e) => handlechange(e)}
              style={{ marginTop: '10px' }}
              name="avenue"
              autoComplete="off"
              fullWidth
              label="avenue"
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <TextField
              onChange={(e) => handlechange(e)}
              style={{ marginTop: '10px' }}
              name="reference"
              autoComplete="off"
              fullWidth
              label="Reference"
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <AutoComplement value={satSelect} setValue={setSatSelect} options={sat} title="Sat" propr="nom_SAT" />
          </div>
          <div style={{ marginTop: '10px' }}>
            <Button onClick={(e) => sendData(e)} fullWidth color="primary" variant="contained">
              <Save fontSize="small" /> <span style={{ marginLeft: '10px' }}>Escalader</span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default InfoClient;
