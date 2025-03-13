import { CircularProgress, Grid, Typography } from '@mui/material';
import axios from 'axios';
import AutoComplement from 'Control/AutoComplet';
import SimpleBackdrop from 'Control/Backdrop';
import DirectionSnackbar from 'Control/SnackBar';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, portofolio } from 'static/Lien';
import * as xlsx from 'xlsx';
import './upload.style.css';

function UploadClient() {
  const [data, setData] = React.useState();
  const projet = useSelector((state) => state.projet.projet);
  const [projetSelect, setProjetSelect] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const column = ['codeclient', 'customer_name', 'region', 'contact', 'contact1', 'contact2', 'shop', 'status'];
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
              codeclient: x.codeclient.trim(),
              customer_name: x.customer_name.trim(),
              region: x.region.trim(),
              shop: x.shop.trim(),
              status: x.status.trim(),
              first_number: x.contact.trim(),
              second_number: x.contact1.trim(),
              payment_number: x.contact2.trim()
            };
          });
          if (vrai.filter((x) => !x.first_number || !x.codeclient || !x.customer_name || !x.region || !x.shop || !x.status).length > 0) {
            setMessage("Le champs ayant l'asterisque ne doit pas etre vide");
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
      let donner = data.map(function (x) {
        return {
          ...x,
          idProjet: projetSelect?.id
        };
      });
      const response = await axios.post(portofolio + '/database', { data: donner }, config);
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
      <Grid container>
        <Grid item lg={6}>
          {projet && (
            <AutoComplement
              id="_id"
              value={projetSelect}
              setValue={setProjetSelect}
              options={projet}
              title="Selectionnez un projet *"
              propr="title"
            />
          )}
        </Grid>
        <Grid item lg={6} className="p_display">
          <p>Le fichier doit inclure ces colonnes avec une écriture uniforme</p>
        </Grid>
      </Grid>
      {message && <DirectionSnackbar message={message} />}
      {sending && <SimpleBackdrop open={sending} title="Chargement..." taille="10rem" />}
      {!sending && (
        <Grid item lg={3} xs={12} sm={6} md={6} sx={{ margin: '10px' }}>
          <input type="file" id="actual-btn" accept=".xlsx" hidden onChange={(e) => readUploadFile(e)} />
          <label className="label" htmlFor="actual-btn">
            Cliquez ici pour uploader le fichier *
          </label>
        </Grid>
      )}

      <table>
        <thead>
          <tr>
            <td>
              codeclient<span style={{ color: 'red', fontSize: '13px', fontWeight: 'bolder' }}>*</span>
            </td>
            <td>
              customer_name <span style={{ color: 'red', fontWeight: 'bolder' }}>*</span>
            </td>
            <td>
              status<span style={{ color: 'red', fontWeight: 'bolder' }}>*</span>
            </td>
            <td>
              region<span style={{ color: 'red', fontWeight: 'bolder' }}>*</span>
            </td>
            <td>
              shop<span style={{ color: 'red', fontWeight: 'bolder' }}>*</span>
            </td>
            <td>
              first_number<span style={{ color: 'red', fontWeight: 'bolder' }}>*</span>
            </td>
            <td>second_number</td>
            <td>payment_number</td>
          </tr>
        </thead>

        {data && data.length > 0 ? (
          <tbody>
            {data.map((index, key) => {
              return (
                <tr key={key}>
                  <td>{index.codeclient}</td>
                  <td>{index.customer_name}</td>
                  <td>{index.status}</td>
                  <td>{index.region}</td>
                  <td>{index.shop}</td>
                  <td>{index.first_number}</td>
                  <td>{index.second_number}</td>
                  <td>{index.payment_number}</td>
                </tr>
              );
            })}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td>Cette colonne reçoit le code client</td>
              <td>Cette colonne reçoit le nom du client</td>
              <td>Cette colonne reçoit le statut du client (late ou default)</td>
              <td>Cette colonne reçoit la region du client</td>
              <td>Cette colonne reçoit le shop du client</td>
              <td>Cette colonne reçoit le premier numero de telephone du client </td>
              <td>Cette colonne reçoit le deuxieme numero de telephone du client </td>
              <td>Cette colonne reçoit le troisieme numero de telephone du client </td>
            </tr>
          </tbody>
        )}
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
