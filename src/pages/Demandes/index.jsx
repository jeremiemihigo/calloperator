import { Grid, Paper } from '@mui/material';
import './chat.css';
import ContextDemande from './ContextDemande';
import Liste from './Liste';
import ReponseAdmin from './Reponse';

function Index() {
  return (
    <ContextDemande>
      <Paper sx={{ padding: '5px' }}>
        <Grid container>
          <Grid item xs={12} md={5} lg={4} sm={5}>
            <Liste />
          </Grid>
          <Grid item xs={12} md={7} lg={8} sm={7} sx={{ paddingLeft: '30px' }}>
            <ReponseAdmin />
          </Grid>
        </Grid>
      </Paper>
    </ContextDemande>
  );
}
export default Index;
