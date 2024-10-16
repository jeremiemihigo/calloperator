import { Grid, Paper, Typography } from '@mui/material';
import Contexte from '../Contexte';
import EditComplaint from './EditComplaint';

function IndexEdit() {
  return (
    <Contexte>
      <Grid container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Grid item lg={6}>
          <Paper elevation={3} sx={{ padding: '10px' }}>
            <Typography component="p" sx={{ marginBottom: '14px', fontWeight: 'bolder' }}>
              Edit complaint
            </Typography>
            <EditComplaint />
          </Paper>
        </Grid>
      </Grid>
    </Contexte>
  );
}

export default IndexEdit;
