import { Paper } from '@mui/material';
import Tabs from 'Control/Tabs';
import Formulaire from 'pages/Portofolio/Parametre/Formulaire';
import Projet from 'pages/Portofolio/Parametre/Projet';
import UploadFile from 'pages/Portofolio/Parametre/Upload';

function Index() {
  const titres = [
    { id: 0, label: 'Formulaire' },
    { id: 1, label: 'Projet' },
    { id: 2, label: 'Upload' }
  ];
  const component = [
    { id: 0, component: <Formulaire /> },
    { id: 1, component: <Projet /> },
    { id: 2, component: <UploadFile /> }
  ];
  return (
    <Paper>
      <Tabs titres={titres} components={component} />
    </Paper>
  );
}

export default Index;
