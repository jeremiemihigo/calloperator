import React from 'react';
import { Paper, Fab } from '@mui/material';
import Table from './Table';
import { Add } from '../../../node_modules/@mui/icons-material/index';
import Popup from 'static/Popup';
import FormRaison from './FormRaison';

function Index() {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ width: '70%', padding: '10px' }}>
        <div style={{ display: 'flex' }}>
          <Fab size="medium" color="primary" onClick={() => setOpen(true)}>
            <Add fontSize="small" />
          </Fab>
        </div>
        <div>
          <Table />
        </div>
      </Paper>
      <Popup open={open} setOpen={setOpen} title="Ajoutez un feedback">
        <FormRaison />
      </Popup>
    </div>
  );
}
export default Index;
