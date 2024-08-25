import { Grid, Paper, Typography } from '@mui/material';
import PropType from 'prop-types';
import React from 'react';
import Form from './Form';
import HistoriqueClient from './HistoriqueClient';
import Liste from './Liste';
import './style.css';

function IndexForm({ property }) {
  const [select, setSelected] = React.useState(0);
  return (
    <Grid container>
      <Grid item lg={5} xs={12} sm={12} md={6}>
        <Paper elevation={4} sx={{ padding: '10px' }}>
          <Form property={property} />
        </Paper>
      </Grid>
      <Grid item lg={7} xs={12} sm={12} md={6}>
        <Paper elevation={4} sx={{ marginLeft: '10px' }}>
          <div className="titre">
            <Typography onClick={() => setSelected(0)}>Historique d&apos;appels</Typography>
            <Typography onClick={() => setSelected(1)}>Today</Typography>
          </div>
          {select === 0 && <HistoriqueClient />}
          {select === 1 && <Liste />}
        </Paper>
      </Grid>
    </Grid>
  );
}
IndexForm.propTypes = {
  property: PropType.string
};
export default IndexForm;
