/* eslint-disable react/prop-types */
import { Paper } from '@mui/material';

function AffichageStat({ listeDemande }) {
  return (
    <>
      <Paper
        className="statDemande"
        elevation={3}
        sx={{ marginTop: '20px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {listeDemande && (
          <p style={{ textAlign: 'center', padding: '0px', margin: '0px' }}>
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
      </Paper>
    </>
  );
}

export default AffichageStat;
