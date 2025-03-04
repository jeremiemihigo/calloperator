import { CircularProgress, Grid, Typography } from '@mui/material';
import axios from 'axios';
import SimpleBackdrop from 'components/Backdrop';
import DirectionSnackbar from 'components/Direction';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { config, les_actions, lien_dt } from 'static/Lien';
import * as xlsx from 'xlsx';
import { Delete } from '../../../../node_modules/@mui/icons-material/index';
import '../../Clients/style.css';

function ActionValidation() {
  const [data, setData] = React.useState();
  const [sending, setSending] = React.useState(false);
  const column = ['codeclient', 'region', 'shop', 'codeAgent', 'action', 'commentaire'];
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
            setMessage(`Erreur sur la colonne ${nexistepas.join('')}`);
            setSending(false);
          } else {
            let table = [];
            for (let i = 0; i < json.length; i++) {
              table.push({
                codeclient: json[i].codeclient,
                region: json[i].region,
                shop: json[i].shop,
                codeAgent: json[i].codeAgent,
                action: json[i].action,
                status: les_actions.includes(json[i].action),
                commentaire: json[i].commentaire
              });
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
    setMessage();
    try {
      const response = await axios.post(lien_dt + '/change_action_excel', { data }, config);
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
                <td>codeclient</td>
                <td>region </td>
                <td>shop</td>
                <td>action</td>
                <td>codeAgent</td>
                <td>commentaire</td>
                <td>Remove</td>
              </tr>
            </thead>
            <tbody>
              {data.map((index, key) => {
                return (
                  <tr className={!index.status ? 'error_code' : 'code'} key={key}>
                    <td>{key + 1}</td>
                    <td>{index.codeclient}</td>
                    <td>{index.region}</td>
                    <td>{index.shop}</td>
                    <td>{index.action}</td>
                    <td>{index.codeAgent}</td>
                    <td>{index.commentaire}</td>
                    <td>
                      <Delete onClick={() => setData(data.filter((x) => x.codeclient !== index.codeclient))} fontSize="small" />
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
                <td>region </td>
                <td>shop</td>
                <td>action</td>
                <td>codeAgent</td>
                <td>commentaire</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cette colonne reçoit le code client</td>
                <td>La region du client</td>
                <td>Le shop du client</td>
                <td>
                  Le type d&apos;action effectuée
                  <ol>
                    {les_actions.map((index) => {
                      return <li key={index}>{index}</li>;
                    })}
                  </ol>
                </td>
                <td>Le code de l&apos;agent ayant effectué l&apos;action</td>
                <td>Commentaire si possible</td>
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
