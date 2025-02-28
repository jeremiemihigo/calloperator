import { Grid } from '@mui/material';
import { Paper } from '../../../../../node_modules/@mui/material/index';
import Context from '../Context';
import AddForm from './AddForm';
import AddQuestion from './AddQuestion';
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
          <Paper elevation={2} className="_paper_one">
            <AddQuestion />
          </Paper>
        </Grid>
      </Grid>
    </Context>
  );
}

export default index;
