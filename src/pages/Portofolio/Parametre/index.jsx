import { Paper } from '@mui/material';
import Tabs from 'Control/Tabs';
import Formulaire from 'pages/Portofolio/Parametre/Formulaire';
import Projet from 'pages/Portofolio/Parametre/Projet';

function Index() {
  const titres = [
    { id: 0, label: 'Formulaire' },
    { id: 1, label: 'Projet' }
  ];
  const component = [
    { id: 0, component: <Formulaire /> },
    { id: 1, component: <Projet /> }
  ];
  return (
    <Paper>
      <Tabs titres={titres} components={component} />
    </Paper>
  );
}

export default Index;
