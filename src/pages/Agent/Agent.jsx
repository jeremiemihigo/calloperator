/* eslint-disable react/prop-types */
import { Button, Checkbox, CircularProgress, Grid, Typography, TextField } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DirectionSnackbar from 'Control/SnackBar';
import { AjouterAgent, UpdateAgent } from 'Redux/Agent';
import AutoComplement from 'Control/AutoComplet';
import { Edit, Save } from '@mui/icons-material';

function AddAgent({ data }) {
  const [values, setValue] = React.useState({
    nom: '',
    telephone: '',
    codeAgent: '',
    fonction: ''
  });
  const dispatch = useDispatch();
  const zone = useSelector((state) => state.zone);
  const [valueRegionSelect, setValueRegionSelect] = React.useState('');
  const [valueShopSelect, setValueShopSelect] = React.useState('');
  // eslint-disable-next-line no-unused-vars
  const { nom, telephone, codeAgent, fonction } = values;
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
      setValueRegionSelect({ ...data?.region });
      setValueShopSelect({ ...data?.shop });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const agent = useSelector((state) => state.agent);
  const [open, setOpen] = React.useState(false);
  const send = (e) => {
    e.preventDefault();
    try {
      //nom, codeAgent, fonction, telephone, idZone, idShop
      let donner = { nom, telephone, codeAgent, fonction, idZone: valueRegionSelect?.idZone, idShop: valueShopSelect?.idShop };
      dispatch(AjouterAgent(donner));
      setOpen(true);
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };

  const label = [
    { id: 1, title: 'Tech', value: 'tech' },
    { id: 2, title: 'agent', value: 'agent' }
  ];
  const [errorAlert, setErrorAlert] = React.useState();
  const sendUpdate = () => {
    try {
      if (valueRegionSelect.idZone !== valueShopSelect.idZone) {
        setErrorAlert(`le shop << ${valueShopSelect.shop} >> n'est pas de la region << ${valueRegionSelect.denomination} >>`);
        setOpen(true);
      } else {
        let donner = { values, zoneSelect: valueRegionSelect?.idZone, shop: valueShopSelect?.idShop };
        dispatch(UpdateAgent(donner));
      }
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
      {errorAlert && <DirectionSnackbar message={errorAlert} open={open} setOpen={setOpen} />}
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
      <>
        <Grid sx={{ marginTop: '10px' }}>
          {zone && zone.zone.length > 0 && (
            <AutoComplement
              value={valueRegionSelect}
              setValue={setValueRegionSelect}
              options={zone?.zone}
              title={zone && zone.zone.length < 1 ? 'Loading...' : 'Regions'}
              propr="denomination"
            />
          )}
        </Grid>
        <Grid sx={{ marginTop: '10px' }}>
          {valueRegionSelect !== '' && valueRegionSelect !== null && (
            <AutoComplement
              value={valueShopSelect}
              setValue={setValueShopSelect}
              options={valueRegionSelect && valueRegionSelect.shop}
              title="Shop"
              propr="shop"
            />
          )}
        </Grid>

        {/* <div>
            <TextField className="textField" onChange={onChange} value={shop} label="Shop" name="shop" autoComplete="on" fullWidth />
          </div>

          {zone.zone && (
            <div>
              <AutoComplement value={zoneSelect} setValue={setZone} options={zone.zone} title="Selectionnez la zone d'affectation" />
            </div>
          )} */}
      </>
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
