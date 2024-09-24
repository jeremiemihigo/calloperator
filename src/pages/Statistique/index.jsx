/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Search } from '@mui/icons-material';
import { Button, Grid } from '@mui/material';
import { Input } from 'antd';
import axios from 'axios';
import MainCard from 'components/MainCard';
import AutoComplement from 'Control/AutoComplet';
import BasicTabs from 'Control/Tabs';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, lien } from 'static/Lien';
import '../style.css';
import AffichageStat from './AffichageStat';
import Agents from './Agents';
import Graphique from './Graphique';
import Regions from './Regions';

function Statistiques() {
  const region = useSelector((state) => state.zone);
  const [value, setValue] = React.useState('');
  const [shopSelect, setShopSelect] = React.useState('');
  const [dates, setDates] = React.useState({ debut: '', fin: '' });
  const { debut, fin } = dates;

  const [fetch, setFetch] = React.useState(false);
  const [donner, setDonner] = React.useState();

  const sendDataFectch = (e) => {
    e.preventDefault();
    const donner = {
      region: value ? value.idZone : undefined,
      idShop: shopSelect ? shopSelect.idShop : undefined
    };
    let sended = {};
    if (donner.idShop !== undefined) {
      sended.idShop = donner.idShop;
    }
    if (donner.region !== undefined) {
      sended.codeZone = donner.region;
    }
    setDonner(sended);
  };

  const [listeDemande, setListeDemande] = React.useState();
  const loadingDemandes = async () => {
    setFetch(true);
    try {
      axios
        .post(lien + '/demandeAgentAll', { data: donner, debut: debut.split('T')[0], fin: fin.split('T')[0] }, config)
        .then((response) => {
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
      {/* {valeur && <Alert severity="error">{message}</Alert>} */}
      <Grid container>
        {region?.zone.length > 0 && (
          <Grid item lg={2} sm={6} xs={12} md={6} sx={{ padding: '5px' }}>
            <AutoComplement value={value} setValue={setValue} options={region.zone} title="Régions" propr="denomination" />
          </Grid>
        )}
        {value && (
          <Grid item lg={2} sm={6} md={6} xs={12} sx={{ padding: '5px' }}>
            <AutoComplement value={shopSelect} setValue={setShopSelect} options={value.shop} title="Shop" propr="shop" />
          </Grid>
        )}

        <Grid item lg={3} sm={6} xs={12} md={6} sx={{ padding: '5px', display: 'flex', alignItems: 'center' }}>
          <Input
            type="date"
            onChange={(e) =>
              setDates({
                ...dates,
                debut: e.target.value
              })
            }
            placeholder="Date"
          />
        </Grid>
        <Grid item lg={3} sm={6} xs={12} md={6} sx={{ padding: '5px', display: 'flex', alignItems: 'center' }}>
          <Input
            onChange={(e) =>
              setDates({
                ...dates,
                fin: e.target.value
              })
            }
            type="date"
            placeholder="Date"
          />
        </Grid>

        <Grid item lg={2} sx={{ padding: '5px', display: 'flex', alignItems: 'center' }}>
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
