import { Paper } from '@mui/material';
import './graphique.style.css';
import Graphique from './ReportAreaChart';

function Index() {
  return (
    <Paper elevation={2} className="papierg">
      <Graphique />
    </Paper>
  );
}

export default Index;
