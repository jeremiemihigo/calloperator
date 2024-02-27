/* eslint-disable react/prop-types */
import { Button, Checkbox, CircularProgress, Typography, TextField } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DirectionSnackbar from 'Control/SnackBar';
import { AjouterAgent, UpdateAgent } from 'Redux/Agent';
import AutoComplement from 'static/AutoComplete';
import { Edit, Save } from '@mui/icons-material';

function AddAgent({ data }) {
  const [values, setValue] = React.useState({
    nom: '',
    shop: '',
    telephone: '',
    codeAgent: '',
    fonction: ''
  });
  const [zoneSelect, setZone] = React.useState('');

  // eslint-disable-next-line no-unused-vars
  const { nom, shop, telephone, codeAgent, fonction } = values;
  const onChange = (e) => {
    const { name, value } = e.target;
    setValue({
      ...values,
      [name]: value
    });
  };
  React.useEffect(() => {
    if (data) {
      setValue({ ...data });
      if (data.region.length > 0) {
        setZone(data.region[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  const dispatch = useDispatch();
  const zone = useSelector((state) => state.zone);
  const agent = useSelector((state) => state.agent);
  const [open, setOpen] = React.useState(false);
  const send = (e) => {
    e.preventDefault();
    try {
      let donner = { values, zoneSelect };
      dispatch(AjouterAgent(donner));
      setOpen(true);
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };

  const label = [
    { id: 1, title: 'Tech', value: 'tech' },
    { id: 2, title: 'agent', value: 'agent' },
    { id: 3, title: 'Admin', value: 'admin' }
  ];
  const sendUpdate = () => {
    try {
      let donner = { values, zoneSelect };
      dispatch(UpdateAgent(donner));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div style={{ padding: '10px', width: '23rem' }}>
      {agent.addAgent === 'rejected' && <DirectionSnackbar message={agent.addAgentError} open={open} setOpen={setOpen} />}
      {agent.addAgent === 'success' && <DirectionSnackbar message="Enregistrement effectuer" open={true} setOpen={setOpen} />}
      {agent.updateAgent === 'success' && <DirectionSnackbar message="Modification effectuée" open={true} setOpen={setOpen} />}
      {agent.updateAgent === 'rejected' && <DirectionSnackbar message={agent.updateAgentError} open={true} setOpen={setOpen} />}
      <div className="mb-3">
        {label.map((index) => {
          return (
            <Typography
              component="span"
              style={{ cursor: 'pointer' }}
              key={index.id}
              onClick={() =>
                setValue({
                  ...values,
                  fonction: index.value
                })
              }
            >
              <Checkbox key={index.id} checked={fonction == index.value ? true : false} />
              <label>{index.title}</label>
            </Typography>
          );
        })}
      </div>

      <div>
        <TextField className="textField" onChange={onChange} value={nom} label="Noms" name="nom" autoComplete="off" fullWidth />
      </div>
      <div style={{ margin: '10px 0px' }}>
        <TextField
          className="textField"
          onChange={onChange}
          value={telephone}
          label="telephone"
          name="telephone"
          autoComplete="on"
          fullWidth
        />
      </div>
      <div style={{ margin: '10px 0px' }}>
        <TextField
          className="textField"
          onChange={onChange}
          value={codeAgent}
          label="code de l'agent"
          name="codeAgent"
          autoComplete="off"
          fullWidth
        />
      </div>
      {fonction !== 'admin' && (
        <>
          <div>
            <TextField className="textField" onChange={onChange} value={shop} label="Shop" name="shop" autoComplete="on" fullWidth />
          </div>

          {zone.zone && (
            <div>
              <AutoComplement value={zoneSelect} setValue={setZone} options={zone.zone} title="Selectionnez la zone d'affectation" />
            </div>
          )}
        </>
      )}
      <Button
        variant="contained"
        disabled={zone.addZone === 'pending' || agent.updateAgent == 'pending' ? true : false}
        style={{ marginTop: '15px' }}
        onClick={data ? (e) => sendUpdate(e) : (e) => send(e)}
      >
        {zone.addZone === 'pending' && <CircularProgress color="inherit" size={20} />}
        {data ? <Edit fontSize="small" /> : <Save />}
        <span style={{ marginLeft: '10px' }}>{data ? 'Modifier' : 'Enregistrer'}</span>
      </Button>
    </div>
  );
}

export default AddAgent;
