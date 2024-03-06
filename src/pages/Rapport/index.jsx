import React from 'react';
import { Button, Paper, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import axios from 'axios';
import { lien, config } from 'static/Lien';
import ExcelButton from 'static/ExcelButton';
import { Input } from 'antd';
import '../style.css';

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
    return { dates: new Date(date).toLocaleString().split(',')[0], heure: new Date(date).toLocaleString().split(',')[1] };
  };

  const [loading, setLoading] = React.useState(false);

  const searchData = React.useCallback(
    (e) => {
      e.preventDefault();
      setLoading(true);
      let data = {
        debut: dates.debut,
        fin: dates.fin
      };
      axios
        .post(lien + '/rapport', data, config)
        .then((response) => {
          if (response.data.error) {
            setLoading(false);
            alert(response.data.message);
          } else {
            setDonnerFound(response.data);
            const donner = [];
            for (let i = 0; i < response.data.length; i++) {
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
                DATE: new Date(retourDate(response.data[i].createdAt).dates),
                'C.O': response.data[i].agent?.nom,
                'STATUT DE LA DEMANDE': response.data[i].demande.typeImage,
                "HEURE D'ENVOI": `${retourDate(response.data[i].demande.createdAt).heure}`,
                'HEURE DE REPONSE': `${retourDate(response.data[i].createdAt).heure}`,
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
            setSample(donner);
            setNomFile(generateNomFile());
            setLoading(false);
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '10px'
        }}
      >
        <div style={{ display: 'flex', width: '50%' }}>
          <div style={{ width: '50%', paddingRight: '5px' }}>
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
          </div>
          <div style={{ width: '50%', paddingRight: '5px' }}>
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
          </div>
        </div>
        <Button disabled={loading} color="primary" variant="contained" onClick={(e) => searchData(e)}>
          <Search fontSize="small" /> {loading ? 'Loading...' : 'Recherche'}
        </Button>
        <ExcelButton data={samplejson2} title="Export to Excel" fileName={`${nomFile}.xlsx`} />
        <p style={{ textAlign: 'center', fontSize: '15px', marginLeft: '10px' }}>{donnerFound.length} Visite(s)</p>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <td>Code client</td>
              <td>stat.client</td>
              <td>Pay.stat</td>
              <td>DAYS</td>
              <td>demandeur</td>
              <td>code</td>
              <td>Date</td>
              <td>c.o</td>
              <td>Statut</td>
              <td>Raison</td>
            </tr>
          </thead>
          <tbody>
            {donnerFound.length > 0 ? (
              donnerFound.map((index) => {
                return (
                  <tr key={index._id}>
                    <td>{index.codeclient}</td>
                    <td>{index.clientStatut}</td>
                    <td>{index.PayementStatut}</td>
                    <td>{Math.abs(index.consExpDays)}</td>
                    <td>
                      <Typography noWrap sx={{ width: '10rem' }}>
                        {index.demandeur.nom}
                      </Typography>
                    </td>
                    <td>{index.demandeur.codeAgent}</td>
                    <td>{retourDate(index.createdAt).dates}</td>
                    <td>{index.agent.nom}</td>

                    <td>{index.demande.statut}</td>
                    <td>
                      <Typography noWrap sx={{ width: '10rem' }}>
                        {index.demande.raison}
                      </Typography>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td style={{ color: 'red' }} colSpan="12">
                  Aucun résultat...
                </td>
              </tr>
            )}
            <tr></tr>
          </tbody>
        </table>
      </div>
    </Paper>
  );
}

export default Rapport;
