/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector } from 'react-redux';
import { Paper } from '../../../node_modules/@mui/material/index';

function Regions({ listeDemande, region }) {
  const zone = useSelector((state) => state.zone.zone);
  console.log(zone);
  console.log(region);
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

  return (
    <Paper elevation={3}>
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
          {(!region ? zone : [region]).map((index, key) => {
            return (
              <React.Fragment key={key}>
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
    </Paper>
  );
}

export default Regions;
