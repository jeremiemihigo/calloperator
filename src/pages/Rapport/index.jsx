import React from 'react';
import { Paper } from '@mui/material';
import Tabs from 'Control/Tabs';
import Fichier from './Fichier';
import Doublon from './Doublon';
import NonConforme from './NonConforme';
function Index() {
  const titres = [
    { id: 0, label: 'Fichier' },
    { id: 1, label: 'Doublon' },
    { id: 2, label: 'Non conforme' }
  ];
  const component = [
    { id: 0, component: <Fichier /> },
    { id: 1, component: <Doublon /> },
    { id: 2, component: <NonConforme /> }
  ];
  return (
    <Paper>
      <Tabs titres={titres} components={component} />
    </Paper>
  );
}

export default Index;
