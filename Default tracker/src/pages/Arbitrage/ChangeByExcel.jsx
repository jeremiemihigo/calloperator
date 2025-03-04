import { CircularProgress, Grid, Typography } from '@mui/material';
import axios from 'axios';
import SimpleBackdrop from 'components/Backdrop';
import DirectionSnackbar from 'components/Direction';
import EnteteFile from 'components/EnteteFile';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { config, lien_dt } from 'static/Lien';
import * as xlsx from 'xlsx';
import '../Clients/style.css';

function UploadClient() {
  const [data, setData] = React.useState();
  const [sending, setSending] = React.useState(false);
  const column = ['codeclient', 'statut', 'commentaire'];
  const [message, setMessage] = React.useState(false);
  const location = useLocation();
  const { state } = location;

  const navigation = useNavigate();
  React.useEffect(() => {
    if (!state || state.length === 0) {
      navigation('/arbitrage');
    }
  }, [state]);

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

          if (nexistepas.length > 0) {
            setMessage(`Erreur sur la colonne ${nexistepas.join('')}`);
            setSending(false);
          } else {
            let table = [];
            for (let i = 0; i < state.length; i++) {
              if (json.filter((x) => x.codeclient === state[i].codeclient).length > 0) {
                table.push({
                  current_status: state[i].current_status,
                  changeto: state[i].changeto,
                  submitedBy: state[i].submitedBy,
                  id: state[i].id,
                  commentaire: json.filter((x) => x.codeclient === state[i].codeclient)[0]?.commentaire,
                  codeclient: state[i].codeclient,
                  nomclient: state[i].nomclient,
                  feedback: json.filter((x) => x.codeclient === state[i].codeclient)[0]?.statut
                });
              }
            }
            setData(table);
            setSending(false);
          }
        };
        reader.readAsArrayBuffer(e.target.files[0]);
      }
    } catch (error) {
      alert('Error ' + error);
    }
  };
  console.log(data);
  const uploadCustomer = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const response = await axios.post(lien_dt + '/arbitrage_file', { data }, config);

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
      <EnteteFile texte="Arbitration file for this month" />
      {message && <DirectionSnackbar message={message} />}
      <SimpleBackdrop open={sending} title="Please wait..." taille="10rem" />
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
        {data && data.length > 0 && (
          <table>
            <thead>
              <tr>
                <td>codeclient</td>
                <td>Nomclient </td>
                <td>Feedback</td>
                <td>current status</td>
                <td>submitedBy</td>
                <td>Comment</td>
              </tr>
            </thead>
            <tbody>
              {data.map((index) => {
                return (
                  <tr key={index.id}>
                    <td>{index.codeclient}</td>
                    <td>{index.nomclient}</td>
                    <td>{index.feedback}</td>
                    <td>{index.current_status}</td>
                    <td>{index.submitedBy}</td>

                    <td>{index.commentaire}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {!data && (
          <table>
            <thead>
              <tr>
                <td>codeclient</td>
                <td>statut </td>
                <td>commentaire</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cette colonne reçoit le code client</td>
                <td>La decision</td>
                <td>Commentaire</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

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
