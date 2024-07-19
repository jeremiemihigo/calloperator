import { Button, TextField } from '@mui/material';
import { AjouterPlainte } from 'Redux/Plainte';
import React from 'react';
import { useDispatch } from 'react-redux';

function AddPlainte() {
  const [value, setValue] = React.useState('');
  const dispatch = useDispatch();
  const sendPlainte = (e) => {
    e.preventDefault();
    dispatch(AjouterPlainte({ title: value }));
    setValue('');
  };
  return (
    <div style={{ minWidth: '20rem' }}>
      <div style={{ marginBottom: '10px' }}>
        <TextField
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ marginTop: '10px' }}
          name="plainte"
          autoComplete="off"
          fullWidth
          label="Plainte"
        />
      </div>
      <div>
        <Button fullWidth color="primary" onClick={(e) => sendPlainte(e)} variant="contained">
          Send
        </Button>
      </div>
    </div>
  );
}

export default AddPlainte;
