/* eslint-disable react/prop-types */
import { Edit, Save } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, TextField } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { CreateContexte } from 'Context';
import AutoComplement from 'Control/AutoComplet';
import DirectionSnackbar from 'Control/SnackBar';
// import { CreateContexteGlobal } from 'GlobalContext';
import { postReponse } from 'Redux/Reponses';
import axios from 'axios';
import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { config, lien } from 'static/Lien';
import Selected from 'static/Select';

function ReponsesComponent({ update }) {
  const regions = useSelector((state) => state.zone.zone);
  // const { socket } = React.useContext(CreateContexteGlobal);
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
  const { demande } = useContext(CreateContexte);
  const { codeCu, codeClient, consExpDays, nomClient } = intial;
  let [status, setStatut] = React.useState({ payement: '', statut: '' });
  const { payement, statut } = status;
  const [message, setMessage] = React.useState('');
  const [openSnack, setOpenSnack] = React.useState(false);
  const [valueAdresse, setValueAdresse] = React.useState('');

  function reset() {
    setInitial({ codeCu: '', codeClient: '', consExpDays: '', nomClient: '' });
    setStatut({ payement: '', statut: '' });
    setValueRegionSelect('');
    setValueShopSelect('');
    setValueAdresse('');
  }
  const reponse = useSelector((state) => state.reponse);
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

  const userConnect = useSelector((state) => state.user?.user);
  const dispatch = useDispatch();
  const reponseData = async () => {
    if (codeClient.length !== 12 || !codeClient.toUpperCase().trim().startsWith('BDRC')) {
      setMessage("Le code client n'est pas conforme");
      setOpenSnack(true);
    } else {
      if (valueRegionSelect && valueShopSelect && valueRegionSelect.idZone !== valueShopSelect.idZone) {
        setMessage('Veuillez vérifier si le shop est enregistré dans la region selectionée');
        setOpenSnack(true);
      } else {
        if (demande && !['PO', 'ZBM'].includes(demande.agent.fonction) && demande.shopAgent[0]?.idShop !== valueShopSelect.idShop) {
          setMessage(
            `y a pas une conformité entre le shop du client << ${valueShopSelect?.shop} >> et celui de l'agent << ${demande?.shopAgent[0]?.shop} >>`
          );
          setOpenSnack(true);
        } else {
          const datass = {
            idDemande: demande.idDemande,
            codeClient: codeClient.toUpperCase().trim(),
            codeCu: codeCu.trim(),
            codeAgent: userConnect?.codeAgent,
            clientStatut: statut,
            PayementStatut: payement,
            adresschange: valueAdresse,
            consExpDays: consExpDays.trim(),
            nomClient,
            idZone: valueRegionSelect.idZone,
            idShop: valueShopSelect.idShop,
            fonctionAgent: demande.agent.fonction,
            codeAgentDemandeur: demande.agent.codeAgent,
            _idDemande: demande._id,
            nomAgentSave: userConnect?.nom
          };
          dispatch(postReponse(datass));

          // socket.emit('reponse', datass);
        }
      }
    }
  };
  React.useEffect(() => {
    if (reponse.postDemande === 'success') {
      reset();
    }
  }, [reponse]);
  const modifier = async () => {
    setOpenSnack(false);

    axios
      .put(
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
            idShop: valueShopSelect.idShop
          }
        },
        config
      )
      .then((response) => {
        setMessage(response.data);
        reset();
        setOpenSnack(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  React.useEffect(() => {
    if (update) {
      let valeur = {
        consExpDays: update.consExpDays,
        codeClient: update.codeclient,
        codeCu: update.codeCu
      };

      checkStatut(update.consExpDays);
      setInitial({
        ...intial,
        ...valeur
      });
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
    let clients =
      codeClient.trim().length === 12 ? codeClient.toUpperCase().trim() : codeClient.length === 8 ? 'BDRC' + codeClient.trim() : '';
    if (clients !== '') {
      setFeching(true);
      const response = await axios.get(`${lien}/customer/${clients}`);
      if (response.status === 200) {
        setInitial({
          ...intial,
          codeCu: response.data.customer_cu,
          nomClient: response.data.nomClient,
          consExpDays: '',
          codeClient: clients
        });
        setValueShopSelect(response.data.shop);
        setValueRegionSelect(response.data.region);
        setFeching(false);
      } else {
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
  };
  const fecthEnter = (e) => {
    if (e.keyCode === 13) {
      fetchCustomer();
    }
  };
  const postReponseEnter = (e) => {
    if (e.keyCode === 13) {
      reponseData();
    }
  };
  const nothing = () => {};

  const optionChange = [
    { id: 1, title: 'Identifique à pulse', value: 'Identique' },
    { id: 2, title: "N'est pas identifique à pulse", value: "N'est pas identique" }
  ];
  const reponseState = useSelector((state) => state.reponse);

  return (
    <Grid>
      {reponseState.postDemande === 'pending' && (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
          <div>
            <p style={{ textAlign: 'center', margin: '0px', padding: '0px' }}>Please wait...</p>
          </div>
        </Backdrop>
      )}

      {openSnack && <DirectionSnackbar message={message} open={openSnack} setOpen={setOpenSnack} />}
      <Grid container>
        <Grid item lg={10} xs={10}>
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
        <Grid item lg={6} sm={6} xs={12} sx={{ marginTop: '10px' }}>
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
          onKeyUp={!update ? (e) => postReponseEnter(e) : () => nothing()}
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
      <TextField
        style={{ marginTop: '10px' }}
        onChange={(e) => {
          e.preventDefault();
          setStatut({
            ...status,
            statut: e.target.value
          });
        }}
        name="statut"
        autoComplete="off"
        fullWidth
        value={statut}
        label="Statut du client"
      />
      <TextField
        style={{ marginTop: '10px' }}
        onChange={(e) => {
          e.preventDefault();
          setStatut({
            ...status,
            payement: e.target.value
          });
        }}
        name="payement"
        autoComplete="off"
        fullWidth
        value={payement}
        label="Statut Payement"
      />
      <div style={{ marginTop: '10px' }}>
        <Button
          disabled={!demande && !update ? true : false}
          fullWidth
          variant="contained"
          color="primary"
          onClick={
            update
              ? () => modifier()
              : (e) => {
                  e.preventDefault();
                  reponseData();
                }
          }
        >
          {update ? <Edit fontSize="small" /> : <Save fontSize="small" />}{' '}
          <span style={{ marginLeft: '10px' }}> {update ? 'Update' : 'Save'}</span>
        </Button>
      </div>
    </Grid>
  );
}
export default ReponsesComponent;
