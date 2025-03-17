import { Grid } from '@mui/material';
import Context from '../Context';
import AddForm from './AddForm';
import QuestionListe from './QuestionListe';
import SelectForm from './SelectForm';
import './formulaire.style.css';

function index() {
  return (
    <Context>
      <Grid container>
        <Grid item lg={3}>
          <AddForm />
        </Grid>
        <Grid item lg={3}>
          <SelectForm />
        </Grid>
        <Grid item lg={12}>
          <QuestionListe />
        </Grid>
      </Grid>
    </Context>
  );
}

export default index;
