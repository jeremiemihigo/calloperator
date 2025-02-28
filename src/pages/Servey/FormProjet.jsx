import { useAutocomplete } from '@mui/base/useAutocomplete';
import { Check, Save } from '@mui/icons-material';
import { Button, Grid, Paper, TextField } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { AddProjet } from 'Redux/formulaire';
import * as xlsx from 'xlsx';
import { useDispatch } from '../../../node_modules/react-redux/es/exports';
import { InputWrapper, Label, Listbox, Root, StyledTag } from './Intervenant';

function FormProjet() {
  const user = useSelector((state) => state.agentAdmin.agentAdmin);
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl
  } = useAutocomplete({
    id: 'customized-hook-demo',
    multiple: true,
    options: user,
    getOptionLabel: (option) => option.codeAgent
  });
  const [data, setData] = React.useState();
  const [sending, setSending] = React.useState(false);
  const [initiale, setInitiale] = React.useState({ name: '', date: '' });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInitiale({ ...initiale, [name]: value });
  };

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
          setData(json);
          setSending(false);
        };
        reader.readAsArrayBuffer(e.target.files[0]);
      }
    } catch (error) {
      alert('Error ' + error);
    }
  };
  const dispatch = useDispatch();
  const saveProjet = async () => {
    try {
      const donner = {
        customers: data,
        name: initiale.name,
        date: initiale.date,
        intervenant: value.map((x) => x.codeAgent)
      };
      // name, customers, intervenant, date
      dispatch(AddProjet(donner));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Paper elevation={4} sx={{ padding: '10px', margin: '10px' }}>
      <div>
        <TextField onChange={handleChange} label="Nom du projet" name="name" autoComplete="on" fullWidth />
      </div>
      <div style={{ margin: '10px 0px' }}>
        <TextField onChange={handleChange} type="date" label="Durée estimée du projet" name="date" autoComplete="on" fullWidth />
      </div>
      <div>
        <Root>
          <div {...getRootProps()}>
            <Label {...getInputLabelProps()}>Intervenant</Label>
            <InputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''}>
              {value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return <StyledTag key={key} {...tagProps} label={option.codeAgent} />;
              })}
              <input {...getInputProps()} />
            </InputWrapper>
          </div>
          {groupedOptions.length > 0 ? (
            <Listbox {...getListboxProps()}>
              {groupedOptions.map((option, index) => {
                const { key, ...optionProps } = getOptionProps({ option, index });
                return (
                  <li key={key} {...optionProps}>
                    <span>{option.nom}</span>
                    <Check fontSize="small" />
                  </li>
                );
              })}
            </Listbox>
          ) : null}
        </Root>
      </div>
      <Grid>
        <input onChange={(e) => readUploadFile(e)} type="file" id="actual-btn" accept=".xlsx" hidden />
        <label className="label" htmlFor="actual-btn">
          {sending ? 'Loading...' : 'Clic here to choose file'}
        </label>
      </Grid>
      <Grid sx={{ marginTop: '10px' }}>
        <Button onClick={() => saveProjet()} variant="contained" fullWidth color="primary">
          <Save fontSize="small" /> <span style={{ marginLeft: '10px' }}>Enregistrer</span>
        </Button>
      </Grid>
    </Paper>
  );
}

export default FormProjet;
