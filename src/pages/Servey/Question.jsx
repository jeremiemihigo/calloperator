import { TextField } from '@mui/material';
import React from 'react';
import Selected from 'static/Select';
import { Save } from '../../../node_modules/@mui/icons-material/index';
import { Button, Grid } from '../../../node_modules/@mui/material/index';

function Question() {
  //question_name, type, select, textField, idProjet
  const dataSelect = [
    { id: 1, title: 'Text', value: 'text' },
    { id: 2, title: 'Select', value: 'select' }
  ];
  const [type, setType] = React.useState('');

  const [select, setSelect] = React.useState('');
  const typeSelect = [
    { id: 1, title: 'Many', value: 'many' },
    { id: 2, title: 'One', value: 'one' }
  ];
  const dataType = [
    { id: 1, title: 'Nombre', value: 'number' },
    { id: 2, title: 'Texte', value: 'text' },
    { id: 3, title: 'Date', value: 'date' }
  ];
  const [textFiel, setTextField] = React.useState('');
  const [item, setItem] = React.useState([]);
  const [itemchange, setItemChange] = React.useState('');
  const addItem = () => {
    setItem([itemchange, ...item]);
    setItemChange('');
  };

  return (
    <div style={{ width: '25rem', padding: '7px' }}>
      <div>
        <TextField label="Question" name="question_name" autoComplete="on" fullWidth />
      </div>
      <div style={{ margin: '10px 0px' }}>
        <Selected label="Type de question" data={dataSelect} value={type} setValue={setType} />
      </div>
      {/* if type === select on doit choisir si l'agent peut choisir un ou plusieurs criteres*/}
      {type === 'select' && (
        <>
          <div style={{ marginBottom: '10px' }}>
            <Selected label="L'agent peut selectionner combien d'items ?" data={typeSelect} value={select} setValue={setSelect} />
          </div>
          <Grid container>
            <Grid item lg={8}>
              <TextField
                value={itemchange}
                onChange={(e) => setItemChange(e.target.value)}
                label="Ajoutez un item"
                name="item"
                autoComplete="on"
                fullWidth
              />
            </Grid>
            <Grid item lg={4} sx={{ padding: '5px' }}>
              <Button onClick={() => addItem()} color="warning" variant="contained" fullWidth>
                Add
              </Button>
            </Grid>
          </Grid>
          {item.map((index) => {
            return <span key={index}>{index + '; '}</span>;
          })}
        </>
      )}

      {type === 'text' && (
        <div style={{ margin: '10px 0px' }}>
          <Selected label="Type de données" data={dataType} value={textFiel} setValue={setTextField} />
        </div>
      )}

      {/* if type === text on doit renseigner le type de données*/}

      <div style={{ marginTop: '10px' }}>
        <Button fullWidth variant="contained" color="primary">
          <Save fontSize="small" sx={{ marginRight: '10px' }} /> Enregistrer
        </Button>
      </div>
    </div>
  );
}

export default Question;
