import { Delete, Save } from '@mui/icons-material';
import { Button, Grid } from '@mui/material';
import axios from 'axios';
import SimpleBackdrop from 'Control/Backdrop';
import React from 'react';
import { config, portofolio } from 'static/Lien';
import { ContextFeedback } from '../Context';

function SaveComponent({ donner }) {
  const [sending, setSending] = React.useState(false);
  const { setChecked, client, setClient, setData, data } = React.useContext(ContextFeedback);

  // const checkData = () => {
  //   let table = [];
  //   if (formulaire) {
  //     for (let i = 0; i < formulaire.length; i++) {
  //       if (formulaire[i].valueSelect.length > 0 && _.filter(formulaire[i].valueSelect, { required: true }).length > 0) {
  //         for (let y = 0; y < _.filter(formulaire[i].valueSelect, { required: true }).length; y++) {
  //           table.push(_.filter(formulaire[i].valueSelect, { required: true })[y].id);
  //         }
  //       } else {
  //         if (formulaire[i].required) {
  //           table.push(formulaire[i].id);
  //         }
  //       }
  //     }
  //     return table;
  //   }
  // };
  const sendData = async () => {
    try {
      setSending(true);
      const { codeclient, idProjet, region, shop, status } = client;
      let resultat = { ...donner, codeclient, idProjet, shop, region, status };
      const response = await axios.post(portofolio + '/addFeedback', resultat, config);
      setSending(false);
      if (response.status === 200) {
        setData(data.filter((x) => x.codeclient !== response.data.codeclient));
        setChecked('');
        setClient('');
      }
    } catch (error) {
      console.log(error);
    }
  };
  const annuler = () => {
    setChecked('');
    setClient('');
  };

  return (
    <>
      <SimpleBackdrop open={sending} title="Please wait..." taille="10rem" />
      <Grid container>
        <Grid item lg={6} sx={{ padding: '10px' }}>
          <Button disabled={sending} onClick={() => sendData()} fullWidth variant="contained" color="primary">
            <Save fontSize="small" /> <span style={{ marginLeft: '5px' }}>Valider</span>
          </Button>
        </Grid>
        <Grid item lg={6} sx={{ padding: '10px' }}>
          <Button onClick={() => annuler()} fullWidth variant="contained" color="warning">
            <Delete fontSize="small" /> <span style={{ marginLeft: '5px' }}>Annuler</span>
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default SaveComponent;
