import { TextField } from '@mui/material';
import React from 'react';
import { CreateContexteTable } from '../Contexte';
import ButtonEsc from './ButtonEsc';

function Rafraichissement() {
  const { onchange, state } = React.useContext(CreateContexteTable);
  const { rafraichissement } = state;

  return (
    <div>
      <div style={{ marginTop: '10px' }}>
        <TextField
          onChange={(e) => onchange(e)}
          name="rafraichissement"
          autoComplete="off"
          value={rafraichissement}
          fullWidth
          label="Numero decodeur"
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <ButtonEsc title="Escalader" statut="Rafraichissement" />
      </div>
    </div>
  );
}

export default Rafraichissement;
