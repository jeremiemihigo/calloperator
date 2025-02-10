import { Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import Popup from 'static/Popup';
import { CreateContextServey } from './Context';
import FormProjet from './FormProjet';
import Question from './Question';

function AddProjet() {
  const [open, setOpen] = React.useState(false);
  const { projetselect } = React.useContext(CreateContextServey);
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Grid container>
        <Grid item lg={5}>
          <FormProjet />
        </Grid>
        {projetselect && (
          <Grid item lg={7}>
            <Paper elevation={4} sx={{ padding: '10px', margin: '10px' }}>
              <Typography
                component="p"
                style={{ cursor: 'pointer', padding: '0px', margin: '0px', color: 'blue', fontWeight: 'bolder' }}
                onClick={() => setOpen(true)}
              >
                Add a question
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
      <Popup open={open} setOpen={setOpen} title="Add a question">
        <Question />
      </Popup>
    </div>
  );
}

export default AddProjet;
