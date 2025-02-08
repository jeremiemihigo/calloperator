import { TextField } from '@mui/material';
import React from 'react';
import { CreateContexteTable } from '../Contexte';
import ButtonEsc from './ButtonEsc';

function Regularisation() {
  const { onchange, state } = React.useContext(CreateContexteTable);
  const { jours, cu, date_coupure, raison_regul } = state;

  return (
    <div>
      <div>
        <TextField
          style={{ marginTop: '10px' }}
          name="jours"
          value={jours}
          type="number"
          autoComplete="off"
          onChange={(e) => onchange(e)}
          fullWidth
          label="Nombre de jours non consommés"
        />
      </div>
      <div style={{ margin: '10px 0px' }}>
        <TextField
          style={{ marginTop: '10px' }}
          name="cu"
          value={cu}
          autoComplete="off"
          onChange={(e) => onchange(e)}
          fullWidth
          label="Numéro du CU"
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <TextField
          style={{ marginTop: '10px' }}
          name="date_coupure"
          autoComplete="off"
          value={date_coupure}
          onChange={(e) => onchange(e)}
          fullWidth
          type="date"
          label="Date de coupure"
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <TextField
          style={{ marginTop: '10px' }}
          name="raison_regul"
          value={raison_regul}
          autoComplete="off"
          onChange={(e) => onchange(e)}
          fullWidth
          type="text"
          label="Raison"
        />
      </div>

      <div style={{ marginTop: '10px' }}>
        <ButtonEsc title="Regularisation" statut="Regularisation" />
      </div>
    </div>
  );
}

export default Regularisation;
