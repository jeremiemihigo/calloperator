import { Grid } from '@mui/material';
import Attente from './Attente';
import Process from './Process';
import './style.css';

function index() {
  return (
    <Grid container>
      <Grid item lg={7}>
        <Process />
      </Grid>
      <Grid item lg={5}>
        <Attente />
      </Grid>
    </Grid>
  );
}

export default index;
