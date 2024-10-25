/* eslint-disable react/prop-types */
import { Edit } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import AutoComplement from 'Control/AutoComplet';
import { CreateContexteGlobal } from 'GlobalContext';
// import { CreateContexteGlobal } from 'GlobalContext';
import { Image, Space } from 'antd';
import axios from 'axios';
import DirectionSnackbar from 'Control/SnackBar';
import _ from 'lodash';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { config, lien, lien_image } from 'static/Lien';
import Selected from 'static/Select';
import { Backdrop } from '../../../node_modules/@mui/material/index';
import { CreateContexteDemande } from './ContextDemande';
import './update.style.css';

function UpdateForm({ update }) {
  const regions = useSelector((state) => state.zone.zone);
  const shop = useSelector((state) => state.shop.shop);
  const { changeImages, changeRecent } = React.useContext(CreateContexteDemande);
  const [valueRegionSelect, setValueRegionSelect] = React.useState('');
  const [valueShopSelect, setValueShopSelect] = React.useState('');
  const [fetching, setFeching] = React.useState(false);
  const [intial, setInitial] = React.useState({
    codeCu: '',
    codeClient: '',
    consExpDays: '',
    nomClient: ''
  });
  const onChange = (e) => {
    const { name, value } = e.target;
    setInitial({
      ...intial,
      [name]: value
    });
  };
  const { resetData, changeReponse } = useContext(CreateContexteGlobal);
  const { codeCu, codeClient, consExpDays, nomClient } = intial;
  let [status, setStatut] = React.useState({ payement: '', statut: '' });
  const { payement, statut } = status;
  const [message, setMessage] = React.useState('');
  const [openSnack, setOpenSnack] = React.useState(false);
  const [valueAdresse, setValueAdresse] = React.useState('');

  function reset() {
    try {
      setInitial({ codeCu: '', codeClient: '', consExpDays: '', nomClient: '' });
      setStatut({ payement: '', statut: '' });
      setValueRegionSelect('');
      setValueShopSelect('');
      setValueAdresse('');
    } catch (error) {
      console.log(error);
    }
  }
  React.useEffect(() => {
    reset();
  }, [resetData]);

  const [boxes, setBoxes] = React.useState('');

  const checkStatut = (chiffre) => {
    setBoxes('');
    setInitial({
      ...intial,
      consExpDays: chiffre
    });
    let statut = '';
    let payement = '';
    if (chiffre >= 0) {
      statut = 'installed';
      payement = 'normal';
    }
    if (chiffre >= -30 && chiffre <= -1) {
      statut = 'installed';
      payement = 'expired';
    }
    if (chiffre >= -44 && chiffre <= -31) {
      statut = 'installed';
      payement = 'defaulted';
    }
    if (chiffre <= -45) {
      statut = 'pending repossession';
      payement = 'defaulted';
    }
    if (isNaN(chiffre)) {
      statut = '';
      payement = '';
    }
    setStatut({ payement, statut });
    return { payement, statut };
  };

  const user = useSelector((state) => state.user.user);
  const [sending, setSending] = React.useState(false);

  const modifier = async () => {
    setSending(true);
    try {
      if (user?.nom !== update?.agentSave?.nom && user?.fonction !== 'superUser') {
        setMessage(`seulement ${update?.agentSave?.nom} peut apporter une modification à cette réponse`);
        setOpenSnack(true);
        setSending(false);
      } else {
        setOpenSnack(false);
        const response = await axios.put(
          lien + '/reponse',
          {
            idReponse: update._id,
            data: {
              codeclient: codeClient,
              nomClient,
              codeCu,
              clientStatut: statut,
              PayementStatut: payement,
              consExpDays,
              idZone: valueRegionSelect.idZone,
              idShop: valueShopSelect.idShop,
              adresse: valueAdresse
            }
          },
          config
        );
        if (response.status === 200) {
          changeReponse(response.data);
          setSending(false);
          setMessage('Mofication effectuée');
          reset();
          setOpenSnack(true);
          changeRecent();
        } else {
          setSending(false);
          setMessage('Error');
          setOpenSnack(true);
        }
      }
    } catch (error) {
      setMessage('Error ' + error);
      setOpenSnack(true);
      setSending(false);
    }
  };
  const optionChange = [
    { id: 1, title: 'Identifique à pulse', value: 'Identique' },
    { id: 2, title: "N'est pas identifique à pulse", value: "N'est pas identique" }
  ];

  React.useEffect(() => {
    if (update) {
      let valeur = {
        consExpDays: update.consExpDays,
        codeClient: update.codeclient,
        codeCu: update.codeCu,
        nomClient: update.nomClient
      };
      checkStatut(update.consExpDays);
      setInitial({
        ...intial,
        ...valeur
      });
      let adresse = optionChange.filter((x) => x.value === update?.adresschange);
      setValueAdresse(adresse[0].value);
      let zone = _.filter(regions, { idZone: update?.idZone });
      let shopSelect = _.filter(shop, { idShop: update?.idShop });
      setValueRegionSelect(zone[0]);
      setValueShopSelect(shopSelect[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  const functioncheckBox = (valueItem, e) => {
    e.preventDefault();
    setBoxes(valueItem);
    if (valueItem === 'inactive') {
      setStatut({ payement: 'terminated', statut: 'inactive' });
    } else {
      setStatut({ payement: 'pending fulfliment', statut: 'pending activation' });
    }
  };

  const fetchCustomer = async () => {
    try {
      let clients =
        codeClient.trim().length === 12 ? codeClient.toUpperCase().trim() : codeClient.length === 8 ? 'BDRC' + codeClient.trim() : '';
      if (clients !== '') {
        setFeching(true);
        const response = await axios.get(`${lien}/customer/${clients}`);
        if (response.status === 200) {
          const { visites, info } = response.data;
          changeImages(visites);
          setInitial({
            ...intial,
            codeCu: info.customer_cu,
            nomClient: info.nomClient,
            consExpDays: '',
            codeClient: clients
          });
          let zone = regions.filter((x) => x._id === info.region._id);
          setValueShopSelect(info.shop);
          setValueRegionSelect(zone[0]);
          setFeching(false);
        } else {
          setMessage('Tu peux chercher ses informations dans pulse');
          setOpenSnack(true);
          setFeching(false);
          setInitial({
            ...intial,
            codeCu: '',
            nomClient: '',
            consExpDays: ''
          });
          setValueRegionSelect('');
          setValueShopSelect('');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fecthEnter = (e) => {
    if (e.keyCode === 13) {
      fetchCustomer();
    }
  };

  const postReponseEnter = (e) => {
    if (e.keyCode === 13) {
      modifier();
    }
  };

  return (
    <Grid>
      {sending && (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
          <div>
            <p style={{ textAlign: 'center', margin: '0px', padding: '0px' }}>Please wait...</p>
          </div>
        </Backdrop>
      )}
      {openSnack && <DirectionSnackbar message={message} open={openSnack} setOpen={setOpenSnack} />}
      <div className="div_update">
        <p className="nomClient">Update {update?.nomClient}</p>
        <p className="codeclient">{update?.codeclient}</p>
      </div>
      <Grid container>
        <Grid item lg={10} xs={10}>
          <Space size={12}>
            <Image
              width={200}
              src={`${lien_image}/${update.demande.file}`}
              placeholder={<Image preview={false} src={`${lien_image}/${update.demande.file}`} width={200} />}
            />
          </Space>
          <TextField
            style={{ marginTop: '10px' }}
            onChange={(e) => onChange(e)}
            name="codeClient"
            onKeyUp={(e) => fecthEnter(e)}
            autoComplete="off"
            fullWidth
            value={codeClient}
            label="Code du Client"
          />
        </Grid>
        <Grid item lg={2} xs={2} sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}>
          {fetching ? <CircularProgress size={15} /> : <SearchIcon onClick={(e) => fetchCustomer(e)} fontSize="small" />}
        </Grid>
      </Grid>

      <TextField
        style={{ marginTop: '10px' }}
        onChange={(e) => onChange(e)}
        name="nomClient"
        autoComplete="off"
        fullWidth
        value={nomClient}
        label="Nom du Client"
      />
      <TextField
        style={{ marginTop: '10px' }}
        onChange={(e) => onChange(e)}
        value={codeCu}
        name="codeCu"
        autoComplete="off"
        fullWidth
        label="Code CU"
      />
      <Grid container>
        <Grid item lg={6} sm={6} xs={12} sx={{ marginTop: '10px', paddingRight: '3px' }}>
          <AutoComplement
            value={valueRegionSelect}
            setValue={setValueRegionSelect}
            options={regions}
            title={regions && regions.length < 1 ? 'Loading...' : 'Regions'}
            propr="denomination"
          />
        </Grid>
        <Grid item lg={6} sm={6} xs={12} sx={{ marginTop: '10px' }}>
          {valueRegionSelect && valueRegionSelect !== '' && valueRegionSelect !== null && (
            <AutoComplement
              value={valueShopSelect}
              setValue={setValueShopSelect}
              options={valueRegionSelect && valueRegionSelect.shop}
              title="Shop"
              propr="shop"
            />
          )}
        </Grid>
      </Grid>
      <div style={{ margin: '10px 0px' }}>
        <Selected label="Adresse" data={optionChange} value={valueAdresse} setValue={setValueAdresse} />
      </div>
      <div className="expiredDate">
        <TextField
          onChange={(e) => checkStatut(e.target.value)}
          style={{ marginTop: '10px' }}
          name="consExpDays"
          autoComplete="off"
          fullWidth
          onKeyUp={(e) => postReponseEnter(e)}
          value={consExpDays}
          label="consExpDays"
        />
      </div>

      <Box sx={{ display: 'flex' }}>
        <FormControl component="fieldset" variant="standard">
          <FormGroup>
            <FormControlLabel
              onClick={(e) => functioncheckBox('inactive', e)}
              control={<Checkbox name="inactive" checked={boxes === 'inactive'} />}
              label="Inactive"
            />
          </FormGroup>
        </FormControl>
        <FormControl component="fieldset" variant="standard">
          <FormGroup>
            <FormControlLabel
              onClick={(e) => functioncheckBox('pending', e)}
              control={<Checkbox name="pending" checked={boxes === 'pending'} />}
              label="Pending activation"
            />
          </FormGroup>
        </FormControl>
      </Box>
      <Grid container>
        <Grid item lg={6} sx={{ paddingRight: '3px' }}>
          <TextField
            style={{ marginTop: '10px' }}
            onChange={(e) => {
              e.preventDefault();
              setStatut({
                ...status,
                statut: e.target.value
              });
            }}
            disabled
            name="statut"
            autoComplete="off"
            fullWidth
            value={statut}
            label="Statut du client"
          />
        </Grid>
        <Grid item lg={6}>
          {' '}
          <TextField
            style={{ marginTop: '10px' }}
            onChange={(e) => {
              e.preventDefault();
              setStatut({
                ...status,
                payement: e.target.value
              });
            }}
            disabled
            name="payement"
            autoComplete="off"
            fullWidth
            value={payement}
            label="Statut Payement"
          />
        </Grid>
      </Grid>

      <div style={{ marginTop: '10px' }}>
        <Button disabled={!update ? true : false} fullWidth variant="contained" color="primary" onClick={() => modifier()}>
          <Edit fontSize="small" />
          <span style={{ marginLeft: '10px' }}> Update</span>
        </Button>
      </div>
    </Grid>
  );
}
export default UpdateForm;
