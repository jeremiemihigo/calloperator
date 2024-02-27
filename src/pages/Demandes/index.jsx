import Liste from './Liste';
import { Grid, Paper } from '@mui/material';
import ReponseAdmin from './Reponse';
import Chats from './Chats';

function Index() {
  return (
    <Paper sx={{ padding: '5px' }}>
      <Grid container>
        <Grid item xs={2} md={2} lg={2} sm={2}>
          <Chats />
        </Grid>
        <Grid item xs={3} md={3} lg={3} sm={3}>
          <Liste />
        </Grid>
        <Grid item xs={7} md={7} lg={7} sm={7} sx={{ paddingLeft: '30px' }}>
          <ReponseAdmin />
        </Grid>
      </Grid>
    </Paper>
  );
}
export default Index;
