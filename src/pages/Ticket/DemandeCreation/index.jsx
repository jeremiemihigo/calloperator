import React from 'react';
import { Paper, Fab, Tooltip } from '@mui/material';
import { Add } from '@mui/icons-material';
import Popup from 'static/Popup';
import Creation from './Creation';

function Index() {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <Paper elevation={2} sx={{ padding: '3px' }}>
        <Tooltip title="Ajoutez une demande de création d'un ticket">
          <Fab color="primary" size="small" onClick={() => setOpen(true)}>
            <Add fontSize="small" />
          </Fab>
        </Tooltip>
      </Paper>
      <Popup open={open} setOpen={setOpen} title="Demande de création d'un ticket">
        <Creation />
      </Popup>
    </div>
  );
}

export default Index;
