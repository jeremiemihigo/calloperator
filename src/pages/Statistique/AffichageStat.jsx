/* eslint-disable react/prop-types */
import React from 'react';

function AffichageStat({ listeDemande }) {
  return (
    <>
      <div className="statDemande">
        {listeDemande && (
          <p style={{ textAlign: 'center' }}>
            <span style={{ color: 'red', marginRight: '10px', fontSize: '1rem' }}>
              {listeDemande.filter((x) => x.reponse.length > 0).length}
            </span>
            demande(s) repondue(s) sur
            <span style={{ color: 'red', margin: '7px', fontSize: '1rem' }}>{listeDemande.length}</span> demande(s) envoyée(s)
            <span style={{ color: 'red', margin: '7px', fontSize: '1rem' }}>
              {isNaN(((listeDemande.filter((x) => x.reponse.length > 0).length * 100) / listeDemande.length).toFixed(0))
                ? ''
                : 'Soit ' + ((listeDemande.filter((x) => x.reponse.length > 0).length * 100) / listeDemande.length).toFixed(0) + '%'}
            </span>
          </p>
        )}
      </div>
    </>
  );
}

export default AffichageStat;
