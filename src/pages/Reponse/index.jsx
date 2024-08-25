import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';
import ReponseComponent from './Reponse';

export default function CheckboxesGroup() {
  return (
    <MainCard>
      <Box>
        {' '}
        <ReponseComponent />
      </Box>
      {/* <Box>{check === 'codevisite' && <ChercherDemande />}</Box> */}
    </MainCard>
  );
}
