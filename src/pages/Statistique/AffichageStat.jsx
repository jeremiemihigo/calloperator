/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import { Typography, Grid } from '@mui/material';
import { useSelector } from 'react-redux';

function AffichageStat({ listeDemande }) {
  const [data, setData] = React.useState({ valeur: [], keys: [] });
  const regions = useSelector((state) => state.zone.zone);
  const statShop = useSelector((state) => state.statShop.stat);
  const { valeur, keys } = data;
  const analyse = () => {
    try {
      const donne = _.groupBy(listeDemande, 'codeAgent');
      setData({ valeur: donne, keys: Object.keys(donne) });
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    analyse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listeDemande]);

  const showNameCode = (index) => {
    try {
      return {
        nom: valeur['' + index][0].agent.nom,
        code: valeur['' + index][0].agent.codeAgent
      };
    } catch (error) {
      console.log(error);
    }
  };
  const reponduNonRepondu = (index) => {
    try {
      let repondu = 0;
      let nonRepondu = 0;
      for (let i = 0; i < valeur['' + index].length; i++) {
        if (valeur['' + index][i].reponse.length > 0) {
          repondu = repondu + 1;
        } else {
          nonRepondu = nonRepondu + 1;
        }
      }
      return { repondu, nonRepondu };
    } catch (error) {
      console.log(error);
    }
  };
  const [affiche_tab, setAffiche_tab] = React.useState('agent');

  const returnNombre = (codeZone, statutClient, statatPayment) => {
    try {
      let demandeNonVide = listeDemande && listeDemande.filter((x) => x.reponse.length > 0);
      let nombre = demandeNonVide.filter(
        (x) => x.reponse[0].clientStatut === statutClient && x.reponse[0].PayementStatut === statatPayment && x.codeZone === codeZone
      );

      return nombre.length;
    } catch (error) {
      console.log(error);
    }
  };
  const returnAttente = (codeZone) => {
    try {
      let demandeVide = listeDemande && listeDemande.filter((x) => x.reponse.length === 0);
      let nombre = demandeVide.filter((x) => x.codeZone === codeZone);
      return nombre.length;
    } catch (error) {
      console.log(error);
    }
  };
  const returnTotal = (codeZone) => {
    try {
      let demandeVide = listeDemande && listeDemande.filter((x) => x.codeZone === codeZone);
      return { total: demandeVide.length, pourcentage: ((demandeVide.length * 100) / listeDemande.length).toFixed(0) };
    } catch (error) {
      console.log(error);
    }
  };
  const thisMonthToDate = (item, x) => {
    try {
      let result = 0;
      if (x === 'agent') {
        result = _.reduce(item, (prev, curr) => prev + curr.agent, 0);
      }
      if (x === 'tech') {
        result = _.reduce(item, (prev, curr) => prev + curr.tech, 0);
      }
      if (x === 'tot') {
        let agent = _.reduce(item, (prev, curr) => prev + curr.agent, 0);
        let tech = _.reduce(item, (prev, curr) => prev + curr.tech, 0);
        result = agent + tech;
      }

      return result || '';
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="statDemande">
        {listeDemande && (
          <p style={{ textAlign: 'center' }}>
            <span style={{ color: 'red', marginRight: '10px', fontSize: '1rem' }}>
              {listeDemande.filter((x) => x.reponse.length > 0).length}
            </span>
            demande(s) repondue(s) sur
            <span style={{ color: 'red', margin: '7px', fontSize: '1rem' }}>{listeDemande.length}</span> demande(s) envoyée(s) soit{' '}
            <span style={{ color: 'red', margin: '7px', fontSize: '1rem' }}>
              {((listeDemande.filter((x) => x.reponse.length > 0).length * 100) / listeDemande.length).toFixed(0)}%
            </span>
          </p>
        )}
      </div>
      {listeDemande && (
        <div style={{ paddingTop: '5px' }}>
          <Grid container>
            <Grid item lg={3}></Grid>

            <Grid item lg={3}>
              <select
                name="pets"
                id="pet-select"
                onChange={(e) => {
                  e.preventDefault();
                  setAffiche_tab(e.target.value);
                }}
              >
                <option value="agent">Toutes les regions</option>
                <option value="stat">Stat. tous les agents</option>
                <option value="statSaTech">SA & TECH par Region/Shop</option>
              </select>
            </Grid>
          </Grid>

          <Grid container sx={{ marginTop: '20px' }}>
            {affiche_tab === 'agent' && (
              <>
                <table>
                  <thead>
                    <tr style={{ background: '#dedede' }}>
                      <td>Region</td>
                      <td>Statut du client</td>
                      <td>Statut payement</td>
                      <td>Nombre</td>
                      <td>En attente</td>
                    </tr>
                  </thead>
                  <tbody>
                    {regions &&
                      regions.map((index) => {
                        return (
                          <React.Fragment key={index._id}>
                            <tr>
                              <td rowSpan="7">{index.denomination}</td>
                              <td>installed</td>
                              <td>Normal</td>
                              <td>{returnNombre(index.idZone, 'installed', 'normal')}</td>
                              <td rowSpan="6" style={{ fontSize: '25px', fontWeight: 'bolder' }}>
                                {returnAttente(index.idZone)}
                              </td>
                            </tr>
                            <tr>
                              <td>installed</td>
                              <td>expired</td>
                              <td>{returnNombre(index.idZone, 'installed', 'expired')}</td>
                            </tr>
                            <tr>
                              <td>installed</td>
                              <td>Defaulted</td>
                              <td>{returnNombre(index.idZone, 'installed', 'defaulted')}</td>
                            </tr>
                            <tr>
                              <td>pending repossession</td>
                              <td>defaulted</td>
                              <td>{returnNombre(index.idZone, 'pending repossession', 'defaulted')}</td>
                            </tr>

                            <tr>
                              <td>pending activation</td>
                              <td>pending fulfliment</td>
                              <td>{returnNombre(index.idZone, 'pending activation', 'pending fulfliment')}</td>
                            </tr>
                            <tr>
                              <td>inactive</td>
                              <td>terminated</td>
                              <td>{returnNombre(index.idZone, 'inactive', 'terminated')}</td>
                            </tr>
                            <tr style={{ background: '#dedede' }}>
                              <td colSpan="3">Total</td>

                              <td style={{ padding: '0px', margin: '0px', fontWeight: 'bolder' }}>
                                <span style={{ fontSize: '15px' }}>{returnTotal(index.idZone).total}</span>
                                <span> {' Soit ' + returnTotal(index.idZone).pourcentage}%</span>
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                  </tbody>
                </table>
              </>
            )}
            {affiche_tab === 'stat' && (
              <table>
                <thead>
                  <tr>
                    <td>Nom Agent</td>
                    <td>Code agent</td>
                    <td>Repondue(s)</td>
                    <td>Attente(s)</td>
                    <td>Max</td>
                  </tr>
                </thead>
                <tbody>
                  {keys.map((cle) => {
                    return (
                      <tr key={cle}>
                        <td className="nom">
                          <Typography noWrap component="span" fontSize="12px">
                            {showNameCode(cle).nom}
                          </Typography>
                        </td>
                        <td>{showNameCode(cle).code}</td>
                        <td>{reponduNonRepondu(cle).repondu}</td>
                        <td>{reponduNonRepondu(cle).nonRepondu}</td>
                        <td>{reponduNonRepondu(cle).repondu + reponduNonRepondu(cle).nonRepondu}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            {affiche_tab === 'statSaTech' && (
              <table>
                <thead>
                  <tr>
                    <td>Region/Shop</td>
                    <td>Agents</td>
                    <td>Techniciens</td>
                    <td>This month to date</td>
                  </tr>
                </thead>
                <tbody>
                  {statShop &&
                    statShop.map((index) => {
                      return (
                        <React.Fragment key={index.region}>
                          <tr style={{ background: '#dedede' }}>
                            <td>{index.region}</td>
                            <td>{thisMonthToDate(index?.shop, 'agent')}</td>
                            <td>{thisMonthToDate(index?.shop, 'tech')}</td>
                            <td>{thisMonthToDate(index?.shop, 'tot')}</td>
                          </tr>
                          {index.shop.map((item) => {
                            return (
                              <tr key={item.shop}>
                                <td>{item.shop}</td>
                                <td>{item.agent}</td>
                                <td>{item.tech}</td>
                                <td>{item?.tech + item?.agent || ''}</td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                </tbody>
              </table>
            )}
          </Grid>
        </div>
      )}
    </>
  );
}

export default AffichageStat;
