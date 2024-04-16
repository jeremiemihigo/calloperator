/* eslint-disable react/prop-types */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AutoComplement from 'Control/AutoComplet';
import { Button } from '@mui/material';
import { AddCard } from '@mui/icons-material';
import { Tickets } from 'Redux/Shop';

function AddAcces({ data }) {
  const [value, setValue] = React.useState('');
  const agentAdmin = useSelector((state) => state.agentAdmin);
  const [sending, setSending] = React.useState(false);
  const dispatch = useDispatch();
  const sendData = () => {
    setSending(true);
    dispatch(Tickets({ idShop: data?.idShop, codeAgent: value?.codeAgent }));
    setValue('');
    setSending(false);
  };
  return (
    <div style={{ width: '15rem' }}>
      <div style={{ margin: '10px 0px' }}>
        <AutoComplement value={value} setValue={setValue} options={agentAdmin?.agentAdmin} title="Selectionnez un agent" propr="nom" />
      </div>
      <div>
        <Button onClick={() => sendData()} disabled={sending} color="primary" variant="contained">
          <AddCard fontSize="small" sx={{ marginRight: '10px' }} /> Affecter
        </Button>
      </div>
    </div>
  );
}

export default AddAcces;
