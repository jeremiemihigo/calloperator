import React from 'react';
import { Button, Paper, Grid, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import axios from 'axios';
import { lien, config, dateFrancais } from 'static/Lien';
import ExcelButton from 'static/ExcelButton';
import { Input } from 'antd';
import './style.css';
import Plaintes from './Plaintes';
import StatistiqueCO from './StatistiqueCO';
import Analyse from './Analyse';
import dayjs from 'dayjs';

function Rapport() {
  const [dates, setDates] = React.useState({ debut: '', fin: '' });
  const [donnerFound, setDonnerFound] = React.useState([]);
  const [samplejson2, setSample] = React.useState();
  const [nomFile, setNomFile] = React.useState('');
  const returnMois = (chiffre) => {
    if (chiffre === 0) {
      return 'Janvier';
    }
    if (chiffre === 1) {
      return 'Février';
    }
    if (chiffre === 2) {
      return 'Mars';
    }
    if (chiffre === 3) {
      return 'Avril';
    }
    if (chiffre === 4) {
      return 'Mai';
    }
    if (chiffre === 5) {
      return 'Juin';
    }
    if (chiffre === 6) {
      return 'Juillet';
    }
    if (chiffre === 7) {
      return 'Aout';
    }
    if (chiffre === 8) {
      return 'Septembre';
    }
    if (chiffre === 9) {
      return 'Octobre';
    }
    if (chiffre === 10) {
      return 'Novembre';
    }
    if (chiffre === 12) {
      return 'Décembre';
    }
  };
  const generateNomFile = () => {
    try {
      if (dates.debut !== '' && dates.fin !== '') {
        let date1 = new Date(dates.debut);
        let date2 = new Date(dates.fin);
        if (date1.getFullYear() === date2.getFullYear()) {
          if (date1.getMonth() == date2.getMonth()) {
            if (date1.getDate() === date2.getDate()) {
              return `Visites ménages du ${date2.getDate()} ${returnMois(date2.getMonth())} ${date2.getFullYear()}`;
            } else {
              return `Visites ménages allant du ${date1.getDate()} au ${date2.getDate()} ${returnMois(
                date2.getMonth()
              )} ${date2.getFullYear()}`;
            }
          } else {
            return `Visites ménages allant du ${date1.getDate()} ${returnMois(date1.getMonth())} au ${date2.getDate()} ${returnMois(
              date2.getMonth()
            )} ${date2.getFullYear()}`;
          }
        } else {
          return `Visites ménages allant du ${date1.getDate()} ${returnMois(
            date1.getMonth()
          )} ${date1.getFullYear()} au ${date2.getDate()} ${returnMois(date2.getMonth())} ${date2.getFullYear()}`;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const chekValue = (value) => {
    if (value === 'null' || value === 'undefined' || !value) {
      return '';
    } else {
      return value;
    }
  };
  const retourDate = (date) => {
    console.log(date);
    console.log(dayjs(date).format('DD/MM/YYYY'));
    return { dates: dayjs(date).format('DD/MM/YYYY'), heure: dayjs(date).format('hh/mm') };
  };
  const retourDateUpdates = (date) => {
    if (!date.updatedAt) {
      return {
        dates: new Date(date.createdAt).toLocaleString().split(',')[0],
        heure: new Date(date.createdAt).toLocaleString().split(',')[1]
      };
    } else {
      return {
        dates: new Date(date.updatedAt).toLocaleString().split(',')[0],
        heure: new Date(date.updatedAt).toLocaleString().split(',')[1]
      };
    }
  };

  const [loading, setLoading] = React.useState(false);

  const returnTime = (date1, date2) => {
    let resultat = (new Date(date2.createdAt).getTime() - new Date(date1.createdAt).getTime()) / 60000;
    if (resultat < 1) {
      return 1;
    } else {
      return resultat;
    }
  };
  const [temps, setTemps] = React.useState(0);
  const searchData = React.useCallback(
    () => {
      setLoading(true);
      let data = {
        debut: dates.debut,
        fin: dates.fin
      };
      axios
        .post(lien + '/rapport', data, config)

        .then((response) => {
          if (response.data === 'token expired') {
            localStorage.removeItem('auth');
            window.location.replace('/login');
          } else {
            if (response.data.error) {
              setLoading(false);
              alert(response.data.message);
            } else {
              setDonnerFound(response.data);
              let times = 0;
              let donner = [];
              for (let i = 0; i < response.data.length; i++) {
                times = times + returnTime(response.data[i].demande, response.data[i]);
                donner.push({
                  ID: response.data[i].codeclient,
                  NOMS: response.data[i].nomClient,
                  'SERIAL NUMBER': chekValue(response.data[i].codeCu),
                  'CLIENT STATUS': response.data[i].clientStatut,
                  'PAYMENT STATUS': response.data[i].PayementStatut,
                  'CONS. EXP. DAYS': response.data[i].PayementStatut === 'normal' ? 0 : Math.abs(response.data[i].consExpDays),
                  REGION: response.data[i].region,
                  SHOP: response.data[i].shop,
                  'CODE AGENT': response.data[i].demandeur.codeAgent,
                  'NOMS DU DEMANDEUR': response.data[i].demandeur.nom,
                  'SA & TECH': response.data[i].demandeur.fonction !== 'tech' ? 'SA' : 'TECH',
                  DATE: dayjs(response.data[i].createdAt).format('DD/MM/YYYY'),
                  'C.O': response.data[i].agent?.nom,
                  'STATUT DE LA DEMANDE': response.data[i].demande.typeImage,
                  "DATE D'ENVOIE": dayjs(response.data[i].demande.updatedAt).format('DD/MM/YYYY'),
                  "HEURE D'ENVOI": `${retourDateUpdates(response.data[i].demande).heure}`,
                  'HEURE DE REPONSE': `${retourDate(response.data[i].createdAt).heure}`,
                  'TEMPS MOYEN': `${returnTime(response.data[i].demande, response.data[i]).toFixed(0)}`,
                  LONGITUDE: chekValue(response.data[i].demande?.coordonnes.longitude),
                  LATITUDE: chekValue(response.data[i].demande?.coordonnes.latitude),
                  ALTITUDE: chekValue(response.data[i].demande?.coordonnes.altitude),
                  'ETAT PHYSIQUE': response.data[i].demande?.statut,
                  RAISON: response.data[i].demande?.raison,
                  COMMUNE: response.data[i].demande?.commune,
                  QUARTIER: response.data[i].demande?.sector,
                  AVENUE: response.data[i].demande?.cell,
                  REFERENCE: response.data[i].demande?.reference,
                  SAT: response.data[i].demande?.sat,
                  CONTACT: response.data[i].demande?.numero !== 'undefined' ? response.data[i].demande?.numero : ''
                });
              }
              setTemps((times / donner.length).toFixed(0));
              setSample(donner);
              setNomFile(generateNomFile());
              setLoading(false);
            }
          }
        })
        .catch(function (err) {
          console.log(err);
        });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dates]
  );
  return (
    <Paper sx={{ padding: '5px' }} elevation={3}>
      <div>
        <Grid container>
          <Grid item lg={3} sm={3} xs={12} sx={{ marginTop: '5px', paddingRight: '5px' }}>
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
          <Grid item lg={3} sm={3} xs={12} sx={{ marginTop: '5px', paddingRight: '5px' }}>
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
          <Grid item lg={2} sm={2} xs={12} sx={{ marginTop: '5px', paddingRight: '5px' }}>
            <Button disabled={loading} fullWidth color="primary" variant="contained" onClick={() => searchData()}>
              <Search fontSize="small" /> {loading ? 'Loading...' : 'Recherche'}
            </Button>
          </Grid>
          <Grid item lg={2} sm={2} xs={12} sx={{ marginTop: '5px' }}>
            <ExcelButton data={samplejson2} title="Excel" fileName={`${nomFile}.xlsx`} />
          </Grid>
          <Grid item lg={2} sm={2} xs={12} sx={{ marginTop: '5px' }}>
            <p style={{ textAlign: 'center', fontSize: '15px', marginLeft: '10px' }}>
              {donnerFound.length} Visite(s) <span style={{ marginLeft: '20px', color: 'blue', fontWeight: 'bolder' }}>{temps}m</span>
            </p>
          </Grid>
        </Grid>
      </div>
      {donnerFound.length > 0 && (
        <Grid container>
          <Grid item lg={5}>
            <Plaintes data={donnerFound} loadings={searchData} dates={dates} />
          </Grid>
          <Grid item lg={7}>
            <StatistiqueCO data={donnerFound} />
          </Grid>
          <Grid item lg={7} sm={7} xs={12}>
            <Grid className="pagesTitle">
              <Typography>
                Analyse des visites ménages du {dateFrancais(dates.debut)} au {dateFrancais(dates.fin)}
              </Typography>
            </Grid>
            <Analyse data={donnerFound} />
          </Grid>
        </Grid>
      )}
    </Paper>
  );
}

export default Rapport;
