/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import '../style.css';
import { useSelector } from 'react-redux';
import AutoComplement from 'Control/AutoComplet';
import { Alert, Button, Grid } from '@mui/material';
import { Search } from '@mui/icons-material';
import Graphique from './Graphique';
import axios from 'axios';
import { lien, config } from 'static/Lien';
import BasicTabs from 'Control/Tabs';
import MainCard from 'components/MainCard';
import Regions from './Regions';
import Agents from './Agents';
import AffichageStat from './AffichageStat';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function Statistiques() {
  const region = useSelector((state) => state.zone);
  const [value, setValue] = React.useState('');
  const [shopSelect, setShopSelect] = React.useState('');

  const [lot, setLot] = React.useState();
  const periode = useSelector((state) => state.periodeStore);

  const handleChange = (event) => {
    event.preventDefault();
    if (event.target.value === 'aucun') {
      setLot();
    } else {
      setLot(event.target.value);
    }
  };
  const [fetch, setFetch] = React.useState(false);
  const [donner, setDonner] = React.useState();
  const [error, setError] = React.useState({ message: '', valeur: false });
  const { valeur, message } = error;
  const sendDataFectch = (e) => {
    e.preventDefault();
    const donner = {
      region: value ? value.idZone : undefined,
      idShop: shopSelect ? shopSelect.idShop : undefined,
      paquet: lot ? lot : undefined
    };
    const { region, agent, paquet } = donner;
    if (!region && !agent && !paquet) {
      setError({
        valeur: true,
        message: 'Veuillez choisir un critere de selection'
      });
    } else {
      setError({ valeur: false, message: '' });
      let sended = {};
      if (donner.idShop !== undefined) {
        sended.idShop = donner.idShop;
      }
      if (donner.region !== undefined) {
        sended.codeZone = donner.region;
      }
      if (donner.paquet !== undefined) {
        sended.lot = donner.paquet;
      }

      setDonner(sended);
    }
  };

  const [listeDemande, setListeDemande] = React.useState();
  const loadingDemandes = async () => {
    setFetch(true);
    try {
      axios.post(lien + '/demandeAgentAll', donner, config).then((response) => {
        if (response.data === 'token expired') {
          localStorage.removeItem('auth');
          window.location.replace('/login');
        } else {
          setListeDemande(response.data);
          setFetch(false);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    if (donner) {
      loadingDemandes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [donner]);

  const titres = [
    { id: 0, label: 'Graphique' },
    { id: 1, label: 'Régions' },
    { id: 2, label: 'Agents' }
  ];
  return (
    <MainCard>
      {valeur && <Alert severity="error">{message}</Alert>}
      <Grid container>
        {region?.zone.length > 0 && (
          <Grid item lg={3} md={3} xs={12} sx={{ marginTop: '5px' }}>
            <AutoComplement value={value} setValue={setValue} options={region.zone} title="Régions" propr="denomination" />
          </Grid>
        )}
        {value && (
          <Grid item lg={3} md={3} xs={12} sx={{ paddingLeft: '5px', marginTop: '5px' }}>
            <AutoComplement value={shopSelect} setValue={setShopSelect} options={value.shop} title="Shop" propr="shop" />
          </Grid>
        )}

        {periode.getPeriode === 'success' && periode.periode.length > 0 && (
          <Grid item lg={3} md={3} xs={12}>
            <Box sx={{ minWidth: 120, paddingLeft: '5px', marginTop: '5px', paddingRight: '5px' }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Mois</InputLabel>
                <Select labelId="demo-simple-select-label" id="demo-simple-select" value={lot} label="Age" onChange={handleChange}>
                  <MenuItem value="aucun">Aucun</MenuItem>
                  {periode.periode.map((index) => {
                    return (
                      <MenuItem key={index._id} value={index._id}>
                        {index._id}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </Grid>
        )}

        <Grid item lg={3} sx={{ marginTop: '5px', paddingLeft: '5px' }}>
          <Button color="primary" variant="contained" disabled={fetch} onClick={(e) => sendDataFectch(e)}>
            <Search fontSize="small" /> <span style={{ marginLeft: '5px' }}>{fetch ? 'Loading...' : 'Rechercher'}</span>
          </Button>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item lg={12}>
          {listeDemande && (
            <Grid>
              <AffichageStat listeDemande={listeDemande} />
              <BasicTabs
                titres={titres}
                components={[
                  { id: 0, component: <Graphique donner={listeDemande} recherche={donner} /> },
                  { id: 1, component: <Regions region={value} listeDemande={listeDemande} /> },
                  { id: 2, component: <Agents listeDemande={listeDemande} /> }
                ]}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
    </MainCard>
  );
}

export default Statistiques;
