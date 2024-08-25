import { Button, TextField } from '@mui/material';
import { AjouterPlainte } from 'Redux/Plainte';
import React from 'react';
import { useDispatch } from 'react-redux';
import Selected from 'static/Select';

function AddPlainte() {
  const [value, setValue] = React.useState('');
  const plainte = [
    { id: 1, title: 'Shop', value: 'shop' },
    { id: 2, title: 'Call center', value: 'callcenter' },
    { id: 3, title: 'All', value: 'all' }
  ];
  const [property, setProperty] = React.useState('');
  const dispatch = useDispatch();
  const sendPlainte = (e) => {
    e.preventDefault();
    dispatch(AjouterPlainte({ title: value, property }));
    setValue('');
    setProperty('');
  };

  return (
    <div style={{ minWidth: '20rem' }}>
      <div>
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
      <div style={{ margin: '10px 0px' }}>
        <Selected label="Property" data={plainte} value={property} setValue={setProperty} />
      </div>
      <div>
        <Button fullWidth color="primary" onClick={(e) => sendPlainte(e)} variant="contained">
          Send
        </Button>
      </div>
    </div>
  );
}

export default React.memo(AddPlainte);
