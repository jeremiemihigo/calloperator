import { Done } from '@mui/icons-material';
import { Button, TextField } from '@mui/material';
import AutoComplement from 'Control/AutoComplet';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { sat } from 'static/Lien';
import { CreateContexteTable } from './Contexte';

function Adresse({ setOpen }) {
  const { adresse, setAdresse } = React.useContext(CreateContexteTable);
  const [satSelect, setSatSelect] = React.useState('');
  const [shopSelect, setShopSelect] = React.useState('');
  const shop = useSelector((state) => state.shop?.shop);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdresse({
      ...adresse,
      [name]: value
    });
  };
  const continuer = (e) => {
    e.preventDefault();
    setAdresse({
      ...adresse,
      sat: satSelect,
      shop: shopSelect?.shop
    });
    setOpen(false);
  };

  return (
    <div style={{ width: '20rem' }}>
      <div style={{ marginTop: '10px' }}>
        {shop && <AutoComplement value={shopSelect} setValue={setShopSelect} options={shop} title="New customer shop" propr="shop" />}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <TextField
          onChange={(e) => handleChange(e)}
          style={{ marginTop: '10px' }}
          name="commune"
          autoComplete="off"
          fullWidth
          label="Commune"
          value={adresse?.commune}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <TextField
          onChange={(e) => handleChange(e)}
          style={{ marginTop: '10px' }}
          name="quartier"
          autoComplete="off"
          value={adresse?.quartier}
          fullWidth
          label="Quartier"
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <TextField
          onChange={(e) => handleChange(e)}
          style={{ marginTop: '10px' }}
          name="avenue"
          value={adresse?.avenue}
          autoComplete="off"
          fullWidth
          label="avenue"
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <TextField
          onChange={(e) => handleChange(e)}
          style={{ marginTop: '10px' }}
          name="reference"
          autoComplete="off"
          fullWidth
          value={adresse?.reference}
          label="Reference"
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <AutoComplement value={satSelect} setValue={setSatSelect} options={sat} title="Sat" propr="nom_SAT" />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <Button onClick={(e) => continuer(e)} fullWidth variant="contained" color="secondary">
          <Done fontSize="small" />
        </Button>
      </div>
    </div>
  );
}
Adresse.propTypes = {
  setOpen: PropTypes.func
};
export default React.memo(Adresse);
