import React from 'react';
import AgentListeAdmin from './Liste';
import { Paper } from '@mui/material';
import Tabs from 'Control/Tabs';
import PermissionTicket from './PermissionTicket';
function Index() {
  const titres = [
    { id: 0, label: 'Comptes' },
    { id: 1, label: 'Permission Tickets' }
  ];
  const component = [
    { id: 0, component: <AgentListeAdmin /> },
    { id: 1, component: <PermissionTicket /> }
  ];
  return (
    <Paper>
      <Tabs titres={titres} components={component} />
    </Paper>
  );
}

export default Index;
