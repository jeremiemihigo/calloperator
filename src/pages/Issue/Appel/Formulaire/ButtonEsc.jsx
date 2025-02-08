import { Button } from '@mui/material';
import React from 'react';
import { CreateContexteTable } from '../Contexte';

function ButtonEsc({ title, statut }) {
  const { sendEscalader } = React.useContext(CreateContexteTable);
  return (
    <Button onClick={() => sendEscalader(statut)} color="primary" fullWidth variant="contained">
      {title}
    </Button>
  );
}

export default ButtonEsc;
