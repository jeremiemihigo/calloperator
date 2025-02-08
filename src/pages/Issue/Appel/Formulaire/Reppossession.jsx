import { TextField } from '@mui/material';
import React from 'react';
import { CreateContexteTable } from '../Contexte';
import ButtonEsc from './ButtonEsc';

function Repossession() {
  const { state, onchange } = React.useContext(CreateContexteTable);
  const { num_synchro_repo, materiel_repo, raison_repo } = state;

  return (
    <div>
      <div>
        <TextField
          value={num_synchro_repo}
          onChange={(e) => onchange(e)}
          name="num_synchro_repo"
          autoComplete="off"
          fullWidth
          label="Num_synchro"
        />
      </div>
      <div style={{ margin: '10px 0px' }}>
        <TextField
          value={materiel_repo}
          onChange={(e) => onchange(e)}
          name="materiel_repo"
          autoComplete="off"
          fullWidth
          label="Materiels manquants"
        />
      </div>
      <div>
        <TextField value={raison_repo} onChange={(e) => onchange(e)} name="raison_repo" autoComplete="off" fullWidth label="raison" />
      </div>

      <div style={{ marginTop: '10px' }}>
        <ButtonEsc title="Escalader" statut="Repossession volontaire" />
      </div>
    </div>
  );
}

export default Repossession;
