/* eslint-disable react/prop-types */
import { Edit, Save } from '@mui/icons-material';
import { Button, CircularProgress, Grid, TextField } from '@mui/material';
import AutoComplement from 'Control/AutoComplet';
import DirectionSnackbar from 'Control/SnackBar';
import { AjouterAgent, UpdateAgent } from 'Redux/Agent';
import _ from 'lodash';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

function AddAgent({ data }) {
  const [values, setValue] = React.useState({
    nom: '',
    telephone: '',
    codeAgent: ''
  });
  const dispatch = useDispatch();
  const zone = useSelector((state) => state.zone);
  const [valueRegionSelect, setValueRegionSelect] = React.useState('');
  const [valueShopSelect, setValueShopSelect] = React.useState('');
  const [fonction, setFonction] = React.useState('');
  // eslint-disable-next-line no-unused-vars
  const { nom, telephone, codeAgent } = values;
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
      let f = label.filter((x) => x.value === data.fonction)[0];
      setFonction(f);
      let select = _.filter(zone.zone, { idZone: data.codeZone });
      setValueRegionSelect(select[0]);
      if (data?.shop.length > 0) {
        setValueShopSelect(data?.shop[0]);
      } else {
        setValueShopSelect('');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const agent = useSelector((state) => state.agent);
  const [open, setOpen] = React.useState(false);

  const send = (e) => {
    e.preventDefault();
    try {
      //nom, codeAgent, fonction, telephone, idZone, idShop
      let donner = {
        nom,
        telephone,
        fonction: fonction?.value,
        codeAgent,
        idZone: valueRegionSelect?.idZone,
        idShop: valueShopSelect?.idShop
      };

      dispatch(AjouterAgent(donner));
      setValue({
        nom: '',
        telephone: '',
        codeAgent: ''
      });
      setValueRegionSelect('');
      setValueShopSelect('');
      setOpen(true);
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };

  const label = [
    { id: 1, title: 'Technicien (TECH)', value: 'tech' },
    { id: 2, title: 'Agent (SA)', value: 'agent' },
    { id: 3, title: 'Zonal_Business_Manager', value: 'ZBM' },
    { id: 4, title: 'Process_Officer', value: 'PO' },
    { id: 5, title: 'RS', value: 'RS' },
    { id: 6, title: 'Shop_Manager', value: 'SM' },
    { id: 7, title: 'Team_leader', value: 'TL' },
    { id: 8, title: 'Stagiaire', value: 'stagiaire' },
    { id: 8, title: 'Agent_de_recouvrement_(AR)', value: 'AR' },
    { id: 9, title: 'Shop_Assistante', value: 'shop_assistante' }
  ];
  const [errorAlert, setErrorAlert] = React.useState();
  const sendUpdate = () => {
    try {
      if (valueRegionSelect.idZone !== valueShopSelect.idZone && !['ZBM', 'PO'].includes(fonction?.value)) {
        setErrorAlert(`le shop << ${valueShopSelect.shop} >> n'est pas de la region << ${valueRegionSelect.denomination} >>`);
        setOpen(true);
      } else {
        let donner = {
          nom,
          telephone,
          fonction: fonction?.value,
          codeAgent,
          _id: data._id,
          idZone: valueRegionSelect?.idZone,
          idShop: ['ZBM', 'PO'].includes(fonction?.value) ? '' : valueShopSelect?.idShop
        };

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
        <Grid sx={{ marginTop: '10px' }}>
          <AutoComplement value={fonction} setValue={setFonction} options={label} title="Fonction" propr="title" />
        </Grid>
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
        {!['PO', 'ZBM'].includes(fonction?.value) && (
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
        )}
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
