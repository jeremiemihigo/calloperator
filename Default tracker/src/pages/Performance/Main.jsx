import { Grid } from '@mui/material';
import SimpleBackdrop from 'components/Backdrop';
import ChangeByExcel from 'components/ChangeByExcel';
import DirectionSnackbar from 'components/Direction';
import React from 'react';
import * as xlsx from 'xlsx';
import * as XLSX from 'xlsx';
import '../Clients/style.css';
import Affichage from './Affichage';
import { CreateContextePerformance } from './Context';
import FormulairePerformance from './Formulaire';
import MessageComponent from './Message';
import { table, table_keys_only } from './template';

function Main() {
  const [sending, setSending] = React.useState(false);
  const { setDataExcel, result } = React.useContext(CreateContextePerformance);
  const [message, setMessage] = React.useState('');
  const UploadFileObjectif = (e) => {
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
          let object = Object.keys(json[0]);
          let next_pas = table_keys_only.filter((x) => !object.includes(x));
          if (next_pas.length > 0) {
            setMessage('Certaines colonnes ne sont pas renseignées');
            setSending(false);
          } else {
            let donner = json.map((x, key) => {
              return { ...x, id: key };
            });
            console.log(donner);
            setDataExcel(donner);
            setSending(false);
          }
        };
        reader.readAsArrayBuffer(e.target.files[0]);
      }
    } catch (error) {
      alert('Error ' + error);
    }
  };

  const StructureDataExcel = (e) => {
    e.preventDefault();
    const fileName = 'Template_performance';
    const worksheet = XLSX.utils.json_to_sheet(table);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };
  const [open, setOpen] = React.useState(false);
  return (
    <Grid container>
      <Grid item lg={5}>
        {message && <DirectionSnackbar message={message} />}
        {sending && <SimpleBackdrop open={sending} title="Chargement..." taille="10rem" />}
        <Grid container>
          <Grid item lg={6}>
            <ChangeByExcel texte="Export template" onClick={(e) => StructureDataExcel(e)} />
          </Grid>
        </Grid>

        {!sending && (
          <Grid sx={{ paddingLeft: '10px' }}>
            <input type="file" id="performance" accept=".xlsx" hidden onChange={(e) => UploadFileObjectif(e)} />
            <label className="label" htmlFor="performance">
              Cliquez ici pour télécharger le fichier de performance des agents.
            </label>
          </Grid>
        )}

        <FormulairePerformance />
      </Grid>
      <Grid item lg={7} sx={{ padding: '10px' }}>
        {result && result.length > 0 ? <MessageComponent /> : <Affichage />}
      </Grid>
    </Grid>
  );
}

export default Main;
