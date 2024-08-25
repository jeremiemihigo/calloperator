import { Button, Checkbox, Grid, TextField, Typography } from '@mui/material';
import { AddItemPlainte } from 'Redux/Plainte';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import Selected from 'static/Select';

function AddPlainte({ plait_select }) {
  const [property, setProperty] = React.useState('');
  const [addone, setAddOne] = React.useState(false);
  const [table, setTable] = React.useState([]);
  const [valuechange, setValuechange] = React.useState('');
  const [oneormany, setOneormany] = React.useState(false);

  const pushIn = (e) => {
    e.preventDefault();
    if (valuechange !== '') {
      let d = { id: table.length + 1, title: valuechange };
      setTable([d, ...table]);
      setValuechange('');
    }
  };
  console.log(table);
  const deleteone = (d) => {
    setTable(table.filter((x) => x !== d));
  };
  const plainteType = [
    { id: 1, title: 'Shop', value: 'shop' },
    { id: 2, title: 'Call center', value: 'callcenter' },
    { id: 3, title: 'All', value: 'all' }
  ];
  const [ticket, setTicket] = React.useState(false);
  const DemandeTicket = [
    { id: 1, title: 'Demande Creation ticket', value: true },
    { id: 2, title: 'Pas de ticket', value: false }
  ];
  const [adresse, setadresse] = React.useState(false);

  const [value, setValue] = React.useState('');
  const dispatch = useDispatch();
  const sendPlainte = (e) => {
    e.preventDefault();
    dispatch(
      AddItemPlainte({ idPlainte: plait_select?.id, oneormany, other: addone, tableother: table, adresse, ticket, property, title: value })
    );
    setValue('');
    setProperty('');
    setAddOne(false);
    setOneormany(false);
    setTicket(false);
    setadresse(false);
    setTable([]);
  };
  return (
    <div style={{ minWidth: '30rem', paddingTop: '20px' }}>
      <div style={{ marginBottom: '10px' }}>
        <TextField value={value} onChange={(e) => setValue(e.target.value)} name="plainte" autoComplete="off" fullWidth label="Plainte" />
      </div>
      <div style={{ margin: '10px 0px' }}>
        <Selected label="Property" data={plainteType} value={property} setValue={setProperty} />
      </div>
      <div style={{ margin: '10px 0px' }}>
        <Selected label="Ticket" data={DemandeTicket} value={ticket} setValue={setTicket} />
      </div>
      <div style={{ border: '1px dashed black' }}>
        <Typography onClick={() => setadresse(true)} component="span" style={{ cursor: 'pointer' }}>
          <Checkbox checked={adresse} />
          <span>Demande d&apos;adresses</span>
        </Typography>
        <Typography onClick={() => setadresse(false)} component="span" style={{ cursor: 'pointer' }}>
          <Checkbox checked={!adresse} />
          <span>pas d&apos;adresses</span>
        </Typography>
      </div>
      <div>
        <Typography onClick={() => setAddOne(!addone)} component="span" style={{ cursor: 'pointer' }}>
          <Checkbox checked={addone} />
          <span>Add another form</span>
        </Typography>
        {addone && (
          <Typography onClick={() => setOneormany(!oneormany)} component="span" style={{ cursor: 'pointer' }}>
            <Checkbox checked={oneormany} />
            <span>Select one or many items</span>
          </Typography>
        )}
      </div>
      {addone && (
        <Grid container style={{ marginBottom: '10px' }}>
          <Grid item lg={10}>
            <TextField
              value={valuechange}
              onChange={(e) => setValuechange(e.target.value)}
              name="valeur"
              autoComplete="off"
              fullWidth
              label="Value"
            />
          </Grid>
          <Grid item lg={2} sx={{ paddingLeft: '10px' }}>
            <Button onClick={(e) => pushIn(e)} color="info" variant="contained">
              Next
            </Button>
          </Grid>
        </Grid>
      )}
      {table.length > 0 &&
        table.map((index, key) => {
          return (
            <Grid key={key} sx={{ display: 'flex' }}>
              <Typography sx={{ fontSize: '12px' }}>{index.title}</Typography>
              <Typography sx={{ marginLeft: '5px', cursor: 'pointer', fontSize: '11px' }} component="span" onClick={() => deleteone(index)}>
                Delete
              </Typography>
            </Grid>
          );
        })}
      <div>
        <Button fullWidth color="primary" onClick={(e) => sendPlainte(e)} variant="contained">
          Send
        </Button>
      </div>
    </div>
  );
}
AddPlainte.propTypes = {
  plait_select: PropTypes.object
};
export default React.memo(AddPlainte);
