import { Button, TextField } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Postrole } from 'Redux/role';
import Selected from 'static/Select';

function Formulaire() {
  const [role, setRole] = React.useState('');
  const [valueFilter, setDataFilter] = React.useState('');
  const dispatch = useDispatch();
  const sendData = async () => {
    try {
      const donner = {
        title: role,
        filterBy: valueFilter
      };
      dispatch(Postrole(donner));
    } catch (error) {
      console.log(error);
    }
  };
  const dataFilter = [
    { id: 1, title: 'Region', value: 'region' },
    { id: 2, title: 'Shop', value: 'shop' },
    { id: 3, title: 'Feedback en cours', value: 'currentFeedback' },
    { id: 4, title: 'Overall', value: 'all' }
  ];
  return (
    <div style={{ width: '20rem', padding: '10px' }}>
      <div>
        <TextField value={role} onChange={(e) => setRole(e.target.value)} fullWidth label="Role" id="role" />
      </div>
      <div style={{ margin: '10px 0px' }}>
        <Selected label="filter by << default tracker >>" data={dataFilter} value={valueFilter} setValue={setDataFilter} />
      </div>
      <div>
        <Button onClick={(e) => sendData(e)} fullWidth color="primary" variant="contained">
          Valider
        </Button>
      </div>
    </div>
  );
}

export default Formulaire;
