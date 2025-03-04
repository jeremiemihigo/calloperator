import { Grid } from '@mui/material';
import Feedback from './Feedback';

function Acceuil({ client }) {
  return (
    <Grid container>
      <Grid item lg={12} sx={{ padding: '3px' }}>
        <Feedback client={client} />
      </Grid>
    </Grid>
  );
}

export default Acceuil;
