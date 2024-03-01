import Liste from './Liste';
import { Grid, Paper } from '@mui/material';
import ReponseAdmin from './Reponse';

function Index() {
  return (
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
  );
}
export default Index;
