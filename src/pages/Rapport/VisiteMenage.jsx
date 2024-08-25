import { Paper } from '@mui/material';
import Tabs from 'Control/Tabs';
import Doublon from './Doublon';
import Fichier from './Fichier';
import FollowUp from './FollowUp';
import NonConforme from './NonConforme';

function Index() {
  const titres = [
    { id: 0, label: 'Fichier' },
    { id: 1, label: 'Doublon' },
    { id: 2, label: 'Non_conforme' },
    { id: 3, label: 'Follow_up' }
  ];
  const component = [
    { id: 0, component: <Fichier /> },
    { id: 1, component: <Doublon /> },
    { id: 2, component: <NonConforme /> },
    { id: 3, component: <FollowUp /> }
  ];
  return (
    <Paper>
      <Tabs titres={titres} components={component} />
    </Paper>
  );
}

export default Index;
