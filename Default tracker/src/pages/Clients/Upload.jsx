import { CircularProgress, Grid, Typography } from '@mui/material';
import axios from 'axios';
import SimpleBackdrop from 'components/Backdrop';
import DirectionSnackbar from 'components/Direction';
import React from 'react';
import { config, lien_dt } from 'static/Lien';
import * as xlsx from 'xlsx';

function UploadClient() {
  const [data, setData] = React.useState();
  const [sending, setSending] = React.useState(false);
  const column = ['codeclient', 'nomclient', 'region', 'shop', 'par'];
  const [message, setMessage] = React.useState(false);

  const readUploadFile = (e) => {
    e.preventDefault();
    setSending(true);
    try {
      if (e.target.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = xlsx.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = xlsx.utils.sheet_to_json(worksheet);
          const cleFile = Object.keys(json[0]);
          let nexistepas = column.filter((x) => !cleFile.includes(x));
          let vrai = json.map((x) => {
            return {
              codeclient: x.codeclient,
              nomclient: x.nomclient,
              region: x.region,
              shop: x.shop,
              par: x.par,
              currentFeedback: 'Categorisation'
            };
          });
          if (vrai.filter((x) => !x.currentFeedback).length > 0) {
            setMessage('Il y a une erreur dans la rédaction des feedbacks');
            setSending(false);
          } else if (nexistepas.length > 0) {
            setMessage(`Erreur sur la colonne ${nexistepas.join('')}`);
            setSending(false);
          } else {
            setData(vrai);
            setSending(false);
          }
        };
        reader.readAsArrayBuffer(e.target.files[0]);
      }
    } catch (error) {
      alert('Error ' + error);
    }
  };
  const uploadCustomer = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const response = await axios.post(lien_dt + '/upload_customer', { data }, config);
      if (response.status === 200) {
        setMessage(response.data);
        setSending(false);
      } else {
        setMessage('' + response?.data);
        setSending(false);
      }
    } catch (error) {
      setMessage('' + error);
      setSending(false);
    }
  };
  return (
    <>
      {message && <DirectionSnackbar message={message} />}
      {sending && <SimpleBackdrop open={sending} title="Chargement..." taille="10rem" />}
      {!sending && (
        <Grid item lg={3} xs={12} sm={6} md={6} sx={{ paddingLeft: '10px' }}>
          <input type="file" id="actual-btn" accept=".xlsx" hidden onChange={(e) => readUploadFile(e)} />
          <label className="label" htmlFor="actual-btn">
            Cliquez ici pour télécharger le fichier.
          </label>
        </Grid>
      )}
      <div className="p_contain">
        <p>Le fichier doit inclure ces colonnes avec une écriture uniforme</p>
      </div>
      <table>
        <thead>
          <tr>
            <td>codeclient</td>
            <td>nomclient</td>
            <td>par</td>
            <td>region</td>
            <td>shop</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cette colonne reçoit le code client</td>
            <td>Cette colonne reçoit le nom du client</td>
            <td>Cette colonne reçoit le PAR du client</td>
            <td>Cette colonne reçoit la region du client</td>
            <td>Cette colonne reçoit le shop du client</td>
          </tr>
        </tbody>
      </table>
      {data && !sending && (
        <Typography
          onClick={(e) => uploadCustomer(e)}
          sx={{ fontSize: '12px', cursor: 'pointer', marginTop: '10px', textAlign: 'right', color: 'blue' }}
        >
          Envoyer
        </Typography>
      )}
      {sending && !data && (
        <div style={{ display: 'flex', justifyContent: 'right', margin: '10px' }}>
          {' '}
          <CircularProgress size={15} />
        </div>
      )}
    </>
  );
}

export default UploadClient;
