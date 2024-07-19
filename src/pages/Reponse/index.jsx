import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MainCard from 'components/MainCard';
import * as React from 'react';
import ChercherDemande from './ChercherDemande';
import ReponseComponent from './Reponse';

export default function CheckboxesGroup() {
  const [check, setCheck] = React.useState('');
  const onChanges = (valeur) => {
    setCheck(valeur);
  };

  return (
    <MainCard>
      <Box sx={{ display: 'flex' }}>
        <FormControl component="fieldset" variant="standard">
          <FormGroup>
            <FormControlLabel
              onClick={() => onChanges('codeclient')}
              control={<Checkbox checked={check === 'codeclient'} name="codeclient" />}
              label="Code client"
            />
          </FormGroup>
        </FormControl>
        <FormControl component="fieldset" variant="standard">
          <FormGroup>
            <FormControlLabel
              onClick={() => onChanges('codevisite')}
              control={<Checkbox checked={check === 'codevisite'} name="codevisite" />}
              label="ID de la visite"
            />
          </FormGroup>
        </FormControl>
      </Box>
      <Box>{check === 'codeclient' && <ReponseComponent />}</Box>
      <Box>{check === 'codevisite' && <ChercherDemande />}</Box>
    </MainCard>
  );
}
