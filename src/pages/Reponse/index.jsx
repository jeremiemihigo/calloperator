import * as React from 'react';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import ReponseComponent from './Reponse';
import MainCard from 'components/MainCard';
import ChercherDemande from './ChercherDemande';

export default function CheckboxesGroup() {
  const [check, setCheck] = React.useState('');
  const onChanges = (valeur) => {
    setCheck(valeur);
  };

  return (
    <MainCard>
      <Box sx={{ display: 'flex' }}>
        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
          <FormGroup>
            <FormControlLabel
              onClick={() => onChanges('codeclient')}
              control={<Checkbox checked={check === 'codeclient'} name="codeclient" />}
              label="Code client"
            />
          </FormGroup>
        </FormControl>
        <FormControl component="fieldset" sx={{ m: 3 }} variant="standard">
          <FormLabel component="legend"></FormLabel>
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
