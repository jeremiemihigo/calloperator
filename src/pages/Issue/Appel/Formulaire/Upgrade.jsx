import { TextField } from '@mui/material';
import React from 'react';
import { CreateContexteTable } from '../Contexte';
import ButtonEsc from './ButtonEsc';

function Upgrade() {
  const { onchange, state } = React.useContext(CreateContexteTable);
  const { materiel_upgr } = state;

  return (
    <div>
      <div>
        <TextField
          value={materiel_upgr}
          onChange={(e) => onchange(e)}
          name="materiel_upgr"
          autoComplete="off"
          fullWidth
          label="Matériel à upgrader"
        />
      </div>

      <div style={{ marginTop: '10px' }}>
        <ButtonEsc title="Escalader" statut="Upgrade" />
      </div>
    </div>
  );
}

export default Upgrade;
