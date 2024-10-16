import { Search } from '@mui/icons-material';
import { Button, CircularProgress, Grid, Paper } from '@mui/material';
import AutoComplement from 'Control/AutoComplet';
import axios from 'axios';
import _ from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import ExcelButton from 'static/ExcelButton';
import { big_data, config } from 'static/Lien';
import Selected from 'static/Select';
import './style.css';

function Rapport() {
  const [samplejson2, setSample] = React.useState();
  const [nomFile, setNomFile] = React.useState('');

  const select = [
    { id: 1, title: 'Shop', value: 'idShop' },
    { id: 2, title: 'Region', value: 'idZone' },
    { id: 3, title: 'Overall', value: 'overall' }
  ];
  const [valueSelect, setValueSelect] = React.useState('');

  const region = useSelector((state) => state.zone?.zone);
  const [idShop, setValeurShop] = React.useState('');
  const [idZone, setValeurRegion] = React.useState('');

  const chekValue = (value) => {
    if (value === 'null' || value === 'undefined' || !value) {
      return '';
    } else {
      return value;
    }
  };
  const retourDate = (date) => {
    return `${date.split('T')[0]}`;
  };

  const [loading, setLoading] = React.useState(false);

  // const [temps, setTemps] = React.useState(0);
  const shop = useSelector((state) => state.shop?.shop);
  const zone = useSelector((state) => state.zone?.zone);

  const returnShopRegion = (code, status) => {
    console.log(code, status);
    if (status === 'zone') {
      return _.filter(zone, { idZone: code })[0]?.denomination;
    } else {
      return _.filter(shop, { idShop: code })[0]?.shop;
    }
  };
  const retournDateHeure = (valeur) => {
    return `${valeur.split('T')[1].split(':')[0]}:${valeur.split('T')[1].split(':')[1]}`;
  };

  const searchData = async () => {
    try {
      let recherche = {};
      recherche.key = valueSelect;
      recherche.value = valueSelect === 'idShop' ? idShop?.idShop : valueSelect === 'idZone' && idZone?.idZone;
      let dataTosearch = {};
      if (recherche.key !== 'overall') {
        dataTosearch.key = recherche.key;
        dataTosearch.value = recherche.value;
      }
      let data = {
        dataTosearch
      };
      setLoading(true);
      const response = await axios.get(big_data + '/followup', data, config);
      if (response.data === 'token expired') {
        localStorage.removeItem('auth');
        window.location.replace('/login');
      } else {
        let donner = [];
        for (let i = 0; i < response.data.length; i++) {
          donner.push({
            ID: response.data[i].typeVisit.codeclient,
            REGION: returnShopRegion(response.data[i].codeZone, 'zone'),
            SHOP: returnShopRegion(response.data[i]?.idShop, 'shop'),
            'CODE AGENT': response.data[i].codeAgent,
            "DATE D'ENVOIE": retourDate(response.data[i].createdAt),
            "HEURE D'ENVOI": retournDateHeure(response.data[i].createdAt),
            LONGITUDE: chekValue(response.data[i].coordonnee?.longitude),
            LATITUDE: chekValue(response.data[i].coordonnee?.latitude),
            ALTITUDE: chekValue(response.data[i].coordonnee?.altitude),
            'ETAT PHYSIQUE': response.data[i]?.statut === 'allumer' ? 'allumé' : 'eteint',
            RAISON: response.data[i]?.raison,
            COMMUNE: response.data[i]?.commune,
            QUARTIER: response.data[i]?.sector,
            AVENUE: response.data[i]?.cell,
            REFERENCE: response.data[i]?.reference,
            SAT: response.data[i]?.sat,
            CONTACT: response.data[i]?.numero !== 'undefined' ? response.data[i]?.numero : '',
            Adresse: response.data[i]?.adresschange
          });
        }
        setLoading(false);
        setSample(donner);
        setNomFile('Follow up');
      }
    } catch (error) {
      console.log(error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  };
  return (
    <Paper sx={{ padding: '5px' }} elevation={3}>
      {shop && shop.length > 0 && zone && zone.length > 0 ? (
        <>
          <div>
            <Grid container>
              <Grid item lg={2} sx={{ padding: '5px' }} sm={3} xs={12} md={3}>
                <Selected label="Filtrer par" data={select} value={valueSelect} setValue={setValueSelect} />
              </Grid>

              {region && valueSelect === 'idZone' && (
                <Grid item lg={2} sx={{ padding: '5px' }} sm={3} xs={8} md={3}>
                  <AutoComplement
                    value={idZone}
                    setValue={setValeurRegion}
                    options={region}
                    title="Selectionnez la region"
                    propr="denomination"
                  />
                </Grid>
              )}
              {shop && valueSelect === 'idShop' && (
                <Grid item lg={2} sm={3} xs={8} md={3} sx={{ padding: '5px' }}>
                  <AutoComplement value={idShop} setValue={setValeurShop} options={shop} title="Shop" propr="shop" />
                </Grid>
              )}

              <Grid item lg={1} sm={2} xs={6} md={3} sx={{ padding: '5px' }}>
                <Button disabled={loading} fullWidth color="primary" variant="contained" onClick={() => searchData()}>
                  {loading ? <CircularProgress size={12} /> : <Search fontSize="small" />}
                </Button>
              </Grid>
              {!loading && (
                <Grid item lg={1} sm={2} md={3} xs={6} sx={{ padding: '5px' }}>
                  <ExcelButton data={samplejson2} title="" fileName={`${nomFile}.xlsx`} />
                </Grid>
              )}
            </Grid>
          </div>
        </>
      ) : (
        <>
          <p style={{ textAlign: 'center' }}>Patientez le Chargement des shops et regions....</p>
        </>
      )}
    </Paper>
  );
}

export default Rapport;
