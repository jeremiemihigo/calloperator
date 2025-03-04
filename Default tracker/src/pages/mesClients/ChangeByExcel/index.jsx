import { Delete } from '@mui/icons-material';
import { CircularProgress, Grid, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import SimpleBackdrop from 'components/Backdrop';
import { motion } from 'framer-motion';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, lien_dt } from 'static/Lien';
import * as xlsx from 'xlsx';
import '../../Clients/style.css';

function File() {
  const [data, setData] = React.useState();
  const feedback = useSelector((state) => state.feedback.feedback);
  const [customerFound, setCustomerF] = React.useState();
  const [sending, setSending] = React.useState(false);
  const column = ['codeclient', 'nextFeedback'];
  const [message, setMessage] = React.useState('');

  const returnIDFeedbackCode = (id) => {
    if (feedback.filter((x) => x.title === id).length > 0) {
      const { idFeedback, title } = feedback.filter((x) => x.title === id)[0];
      return { idFeedback, title };
    } else {
      return { idFeedback: false, title: false };
    }
  };

  const readUploadFile = (e) => {
    e.preventDefault();
    setSending(true);
    setMessage('');
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
              nextFeedback: returnIDFeedbackCode(x.nextFeedback).title,
              idFeedback: returnIDFeedbackCode(x.nextFeedback).idFeedback
            };
          });
          if (vrai.filter((x) => !x.idFeedback).length > 0) {
            setMessage('Il y a une erreur dans la rédaction des feedbacks');
            setSending(false);
          } else if (nexistepas.length > 0) {
            setMessage(`Erreur sur la colonne ${nexistepas.join('; ')}`);
            setSending(false);
          } else {
            setSending(false);
            setData(vrai);
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
      const response = await axios.post(lien_dt + '/change_by_file', { data }, config);
      if (response.status === 200) {
        setMessage(response.data);
        setSending(false);
      } else {
        setCustomerF(response.data?.result);
        setMessage('' + response?.data.message);
        setSending(false);
      }
    } catch (error) {
      setMessage('' + error);
      setSending(false);
    }
  };

  return (
    <>
      {message !== '' && (
        <motion.div initial={{ x: '-100vw' }} animate={{ x: 0 }} transition={{ type: 'spring', delay: 0.5, duration: 5, stiffness: 120 }}>
          <Alert
            severity="warning"
            onClose={() => {
              setMessage('');
            }}
          >
            {message}
          </Alert>
        </motion.div>
      )}
      <SimpleBackdrop open={sending} title="Chargement..." taille="10rem" />
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
      <div className="divTable">
        <table>
          <thead>
            <tr>
              <td>#</td>
              <td>codeclient</td>
              <td>nextFeedback</td>
              <td>Status_ID</td>
              <td>Delete</td>
            </tr>
          </thead>
          <tbody>
            {data ? (
              data.map((index, key) => {
                return (
                  <tr
                    className={
                      customerFound && customerFound.filter((x) => x.codeclient === index.codeclient).length === 0
                        ? 'error_code'
                        : 'nothing'
                    }
                    key={key}
                  >
                    <td>{key + 1}</td>
                    <td>{index.codeclient}</td>
                    <td>{index.nextFeedback}</td>
                    <td>{index.idFeedback}</td>

                    <td style={{ cursor: 'pointer' }}>
                      <Delete fontSize="small" onClick={() => setData(data.filter((x) => x.codeclient !== index.codeclient))} />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td>1</td>
                <td>Cette colonne reçoit le code client</td>
                <td>Ici vous renseigner l'ancien feedback du client</td>
                <td>Vous pouvez supprimer un client</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {data && !sending && data.filter((x) => !x.nextFeedback).length === 0 && (
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

export default File;
