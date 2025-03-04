import { CircularProgress, Grid, Typography } from '@mui/material';
import axios from 'axios';
import SimpleBackdrop from 'components/Backdrop';
import DirectionSnackbar from 'components/Direction';
import EnteteFile from 'components/EnteteFile';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { config, lien_dt } from 'static/Lien';
import * as xlsx from 'xlsx';
import { Delete } from '../../../node_modules/@mui/icons-material/index';
import '../Clients/style.css';

function ActionValidation() {
  const [data, setData] = React.useState();
  const [sending, setSending] = React.useState(false);
  const column = ['codeclient', 'next_status', 'commentaire'];
  const decision = ['Approved', 'Rejected'];
  const [message, setMessage] = React.useState(false);
  const location = useLocation();
  const { state } = location;
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
            setMessage(
              `${
                nexistepas.length === 0
                  ? `La colonne ${nexistepas.join('')} n'est pas définie`
                  : `Les colonnes ${nexistepas.join('; ')} ne sont pas définies dans le fichier`
              }`
            );
            setSending(false);
          } else {
            let table = [];
            for (let i = 0; i < state.length; i++) {
              if (json.filter((x) => x.codeclient === state[i].codeclient).length > 0) {
                table.push({
                  id: state[i].id,
                  commentaire: json.filter((x) => x.codeclient === state[i].codeclient)[0]?.commentaire,
                  last_statut: state[i].last_statut,
                  codeclient: state[i].codeclient,
                  nomclient: state[i].nomclient,
                  status: decision.includes(json.filter((x) => x.codeclient === state[i].codeclient)[0]?.next_status),
                  next_statut: json.filter((x) => x.codeclient === state[i].codeclient)[0]?.next_status
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
  const uploadCustomer = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const response = await axios.post(lien_dt + '/changeactionbyfile', { data }, config);
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
      <EnteteFile texte="File of actions carried out in this month" />
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
                <td>#</td>
                <td>Customer ID</td>
                <td>Customer name </td>
                <td>Last status</td>
                <td>Next status</td>
                <td>Comment</td>
                <td>Remove</td>
              </tr>
            </thead>
            <tbody>
              {data.map((index, key) => {
                return (
                  <tr className={`${!index.status ? 'error_code' : 'no_error'}`} key={index.id}>
                    <td>{key + 1}</td>
                    <td>{index.codeclient}</td>
                    <td>{index.nomclient}</td>
                    <td>{index.last_statut}</td>
                    <td>{index.next_statut}</td>
                    <td>{index.commentaire}</td>
                    <td>
                      <Delete
                        color="secondary"
                        onClick={() => setData(data.filter((x) => x.codeclient !== index.codeclient))}
                        fontSize="small"
                        sx={{ cursor: 'pointer' }}
                      />
                    </td>
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
                <td>next_status </td>
                <td>commentaire</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cette colonne reçoit le code client</td>
                <td>
                  La decision
                  <ol>
                    <li>Approved or</li>
                    <li>Rejected</li>
                  </ol>
                </td>
                <td>Commentaire</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {data && !sending && data.filter((x) => !x.status).length === 0 && (
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

export default ActionValidation;
