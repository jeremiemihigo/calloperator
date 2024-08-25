import { Button, Grid, TextField } from '@mui/material';
import { message } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';
import React from 'react';
import { Ajouterdelai } from 'Redux/delai';
import { config, lien_issue } from 'static/Lien';
import Selected from 'static/Select';
import { useDispatch } from '../../../node_modules/react-redux/es/exports';

function Formulaire({ plainteSelect }) {
  const days = [
    { id: 1, title: 'Lundi', value: 1 },
    { id: 2, title: 'Mardi', value: 2 },
    { id: 3, title: 'Mercredi', value: 3 },
    { id: 4, title: 'Jeudi', value: 4 },
    { id: 5, title: 'Vendredi', value: 5 },
    { id: 6, title: 'Samedi', value: 6 },
    { id: 7, title: 'Dimanche', value: 7 },
    { id: 8, title: 'Default', value: 8 }
  ];
  const [day, setDays] = React.useState('');
  const [debut, setDebut] = React.useState('');
  const [minutes, setMinutes] = React.useState('');

  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    messageApi.open({
      type,
      content: '' + texte,
      duration: 10
    });
  };

  const dispatch = useDispatch();
  const sendData = async (e) => {
    e.preventDefault();
    if (day === 8) {
      const data = { statut: plainteSelect, minutes };
      const response = await axios.post(lien_issue + '/default_delai', data, config);
      if (response.status === 200) {
        success('Done', 'success');
      }
    } else {
      const data = { plainte: plainteSelect, jour: '' + day, debut: debut, minutes };
      dispatch(Ajouterdelai(data));
    }
  };
  return (
    <>
      {contextHolder}
      <Grid container>
        <Grid item lg={3}>
          <Selected label="Jour" data={days} value={day} setValue={setDays} />
        </Grid>
        {day !== 8 && (
          <Grid item lg={3}>
            <div style={{ margin: '0px 10px' }}>
              <TextField onChange={(e) => setDebut(e.target.value)} type="time" name="time" autoComplete="off" fullWidth label="Time" />
            </div>
          </Grid>
        )}

        <Grid item lg={3}>
          <div style={{ margin: '0px 10px' }}>
            <TextField
              type="number"
              onChange={(e) => setMinutes(e.target.value)}
              name="minutes"
              autoComplete="off"
              fullWidth
              label="Minutes"
            />
          </div>
        </Grid>
        <Grid item lg={3}>
          <div style={{ margin: '0px 10px' }}>
            <Button onClick={(e) => sendData(e)} fullWidth variant="contained" color="primary">
              Valider
            </Button>
          </div>
        </Grid>
      </Grid>
    </>
  );
}

Formulaire.propTypes = {
  plainteSelect: PropTypes.string
};
export default Formulaire;
