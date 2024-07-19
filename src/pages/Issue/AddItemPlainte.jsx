import { Button, TextField } from '@mui/material';
import AutoComplement from 'Control/AutoComplet';
import { AddItemPlainte } from 'Redux/Plainte';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

function AddPlainte() {
  const plainte = useSelector((state) => state.plainte?.plainte);
  const [plait_select, setPlainte] = React.useState('');
  const [value, setValue] = React.useState('');
  const dispatch = useDispatch();
  const sendPlainte = (e) => {
    e.preventDefault();
    dispatch(AddItemPlainte({ idPlainte: plait_select?.id, title: value }));
    setValue('');
    setPlainte('');
  };
  return (
    <div style={{ minWidth: '20rem', paddingTop: '20px' }}>
      <div>
        <AutoComplement value={plait_select} setValue={setPlainte} options={plainte} title="Selectionnez la plainte" propr="title" />
      </div>
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
