/* eslint-disable react/prop-types */
import React from 'react';

function Regions({ listeDemande, region }) {
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
    <div>
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
            <tr>
              <td rowSpan="7">{region.denomination}</td>
              <td>installed</td>
              <td>Normal</td>
              <td>{returnNombre(region.idZone, 'installed', 'normal')}</td>
              <td rowSpan="6" style={{ fontSize: '25px', fontWeight: 'bolder' }}>
                {returnAttente(region.idZone)}
              </td>
            </tr>
            <tr>
              <td>installed</td>
              <td>expired</td>
              <td>{returnNombre(region.idZone, 'installed', 'expired')}</td>
            </tr>
            <tr>
              <td>installed</td>
              <td>Defaulted</td>
              <td>{returnNombre(region.idZone, 'installed', 'defaulted')}</td>
            </tr>
            <tr>
              <td>pending repossession</td>
              <td>defaulted</td>
              <td>{returnNombre(region.idZone, 'pending repossession', 'defaulted')}</td>
            </tr>

            <tr>
              <td>pending activation</td>
              <td>pending fulfliment</td>
              <td>{returnNombre(region.idZone, 'pending activation', 'pending fulfliment')}</td>
            </tr>
            <tr>
              <td>inactive</td>
              <td>terminated</td>
              <td>{returnNombre(region.idZone, 'inactive', 'terminated')}</td>
            </tr>
            <tr style={{ background: '#dedede' }}>
              <td colSpan="3">Total</td>

              <td style={{ padding: '0px', margin: '0px', fontWeight: 'bolder' }}>
                <span style={{ fontSize: '15px' }}>{returnTotal(region.idZone).total}</span>
                <span> {' Soit ' + returnTotal(region.idZone).pourcentage}%</span>
              </td>
            </tr>
          </tbody>
        </table>
      </>
    </div>
  );
}

export default Regions;
