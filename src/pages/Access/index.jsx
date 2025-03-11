import { Paper } from '@mui/material';
import Tabs from 'Control/Tabs';
import Role from 'pages/Access/Role';
import AgentListeAdmin from './Liste';

function Index() {
  const titres = [
    { id: 0, label: 'Count' },
    // { id: 1, label: 'Ticket shop' },
    { id: 1, label: 'Role' }
  ];
  const component = [
    { id: 0, component: <AgentListeAdmin /> },
    { id: 1, component: <Role /> }
  ];
  return (
    <Paper>
      <Tabs titres={titres} components={component} />
    </Paper>
  );
}

export default Index;
