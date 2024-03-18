import { Button, CircularProgress, TextField } from '@mui/material';
import AutoComplement from 'Control/AutoComplet';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import React from 'react';
import { AjouterShop } from 'Redux/Shop';

function AddShop() {
  const [initial, setInitial] = useState({ shop: '', adresse: '' });
  const { shop, adresse } = initial;
  const dispatch = useDispatch();
  const zone = useSelector((state) => state.zone.zone);
  const [value, setValue] = React.useState('');

  const sendData = (e) => {
    e.preventDefault();
    //shop, adresse, idZone
    dispatch(AjouterShop({ shop, adresse, idZone: value !== '' && value.idZone }));
  };

  return (
    <div style={{ padding: '10px', width: '20rem' }}>
      <div>
        <TextField
          onChange={(e) => {
            e.preventDefault();
            setInitial({
              ...initial,
              shop: e.target.value
            });
          }}
          value={shop}
          label="Shop *"
          name="shop"
          autoComplete="off"
          fullWidth
        />
      </div>
      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
        <TextField
          onChange={(e) => {
            e.preventDefault();
            setInitial({
              ...initial,
              adresse: e.target.value
            });
          }}
          value={adresse}
          label="Adresse du shop"
          name="adresse"
          autoComplete="off"
          fullWidth
        />
      </div>
      <div>
        {zone && <AutoComplement value={value} setValue={setValue} options={zone} title="Selectionnez la region" propr="denomination" />}
      </div>
      <Button onClick={(e) => sendData(e)} sx={{ marginTop: '10px' }} variant="contained" fullWidth>
        <CircularProgress color="inherit" size={20} />

        <span style={{ marginLeft: '10px' }}>Enregistrer</span>
      </Button>
    </div>
  );
}

export default AddShop;
