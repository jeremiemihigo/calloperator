import { Paper } from '../../../../../node_modules/@mui/material/index';
import Statistique from './Statistique';

function Index() {
  return (
    <div>
      <Paper className="historical">
        <p>Last technical Issue</p>
      </Paper>
      <Paper className="item_historical">
        <p>Issue : Technical Issue</p>
        <p>Type : Ma batterie n&apos;est pas activée</p>
        <div className="bottom_item">
          <p>Statut : Resolved</p>
          <p>Y a 3 jours</p>
        </div>
      </Paper>
      <Paper className="historical" style={{ marginTop: '10px' }}>
        <p>Last household visit</p>
      </Paper>
      <Paper className="item_historical">
        <p>Le client est en attente de swap</p>
        <div className="bottom_item">
          <p style={{ textAlign: 'right' }}>Y a 3 jours</p>
        </div>
      </Paper>
      <Paper className="historical" style={{ marginTop: '10px' }}>
        <p>Last call portofolio</p>
      </Paper>
      <Paper className="item_historical">
        <p>Le client est en attente de swap</p>
        <div className="bottom_item">
          <p>Jonathan Nyole</p>
          <p style={{ textAlign: 'right' }}>Y a 3 jours</p>
        </div>
      </Paper>
      <div className="statistique">
        <Statistique />
      </div>
    </div>
  );
}

export default Index;
