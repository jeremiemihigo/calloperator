import { Autocomplete, Button, TextField } from '@mui/material';
import AutoComplement from 'Control/AutoComplet';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OtherUpdated } from 'Redux/AgentAdmin';

function Formulaire() {
  const shop = useSelector((state) => state.shop.shop);
  const [shopselect, setShopSelect] = React.useState([]);
  const agentadmin = useSelector((state) => state.agentAdmin?.agentAdmin);
  const [agentSelect, setAgentSelect] = React.useState('');

  const dispatch = useDispatch();
  const send = (e) => {
    e.preventDefault();
    const data = {
      idAgent: agentSelect?._id,
      data: {
        synchro_shop: shopselect.map((index) => {
          return index.shop;
        })
      },
      unset: {}
    };
    dispatch(OtherUpdated(data));
    setAgentSelect('');
    setShopSelect([]);
  };

  return (
    <div style={{ minWidth: '20rem' }}>
      {agentadmin && (
        <div style={{ margin: '10px 0px' }}>
          <AutoComplement value={agentSelect} setValue={setAgentSelect} options={agentadmin} title="Selectionnez un agent" propr="nom" />
        </div>
      )}
      <div style={{ margin: '10px 0px' }}>
        <Autocomplete
          multiple
          value={shopselect}
          id="tags-outlined"
          onChange={(event, newValue) => {
            if (typeof newValue === 'string') {
              setShopSelect({
                title: newValue
              });
            } else if (newValue && newValue.inputValue) {
              // Create a new value from the user input
              setShopSelect({
                title: newValue.inputValue
              });
            } else {
              setShopSelect(newValue);
            }
          }}
          options={shop}
          getOptionLabel={(option) => option.shop}
          filterSelectedOptions
          renderInput={(params) => <TextField {...params} label="Shop" placeholder={'Select a shop'} />}
        />
      </div>
      <div>
        <Button onClick={(e) => send(e)} variant="contained" fullWidth color="primary">
          Valider
        </Button>
      </div>
    </div>
  );
}

export default Formulaire;
