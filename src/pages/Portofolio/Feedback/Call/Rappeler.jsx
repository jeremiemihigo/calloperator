import { TextField } from '@mui/material';
import React from 'react';
import { Paper } from '../../../../../node_modules/@mui/material/index';
import SaveComponent from './SaveComponent';

function Rappeler() {
  const [raison, setRaison] = React.useState('');
  const [date, setDate] = React.useState('');
  const [contact, setContact] = React.useState('');
  return (
    <Paper sx={{ padding: '20px' }}>
      <div style={{ marginBottom: '10px' }}>
        <TextField
          fullWidth
          value={raison}
          onChange={(event) => setRaison(event.target.value)}
          label="raison"
          variant="outlined"
          type="text"
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <TextField
          fullWidth
          value={contact}
          onChange={(event) => setContact(event.target.value)}
          label="Contact du client"
          variant="outlined"
          type="text"
        />
      </div>
      <div>
        <TextField
          variant="outlined"
          fullWidth
          value={date}
          onChange={(event) => setDate(event.target.value)}
          label="La date qu'on rappelera le client"
          type="date"
        />
      </div>
      {raison && date && contact && (
        <SaveComponent
          donner={{
            raison_rappel: raison,
            date_to_recall: date,
            contact,
            type: 'Remind'
          }}
        />
      )}
    </Paper>
  );
}

export default Rappeler;
