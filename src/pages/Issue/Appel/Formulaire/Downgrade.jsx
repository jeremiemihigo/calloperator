import { TextField } from '@mui/material';
import React from 'react';
import { CreateContexteTable } from '../Contexte';
import ButtonEsc from './ButtonEsc';

function Downgrade() {
  const { onchange, state } = React.useContext(CreateContexteTable);
  const { kit_downgrade, num_synchro_downgrade } = state;

  return (
    <div>
      <div style={{ marginTop: '10px' }}>
        <TextField
          value={kit_downgrade}
          onChange={(e) => onchange(e)}
          name="kit_downgrade"
          autoComplete="off"
          fullWidth
          label="kit downgradé"
        />
      </div>
      <div style={{ margin: '10px 0px' }}>
        <TextField
          value={num_synchro_downgrade}
          onChange={(e) => onchange(e)}
          name="num_synchro_downgrade"
          autoComplete="off"
          fullWidth
          label="numéro synchro"
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <ButtonEsc title="Escalader_vers_le_Backoffice" statut="Downgrade" />
      </div>
    </div>
  );
}

export default Downgrade;
