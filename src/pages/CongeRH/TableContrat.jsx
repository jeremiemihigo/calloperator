import React from 'react';
import Popup from 'static/Popup';
import AjouterContrat from './AjouterContrat';
import { Add } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { Fab } from '@mui/material';
import ListeContrat from './ListeContrat';

function TableContrat() {
  const [open, setOpen] = React.useState(false);
  const contrat = useSelector((state) => state.contrat);
  return (
    <div>
      <Fab sx={{ marginBottom: '15px' }} size="small" color="primary" onClick={() => setOpen(true)}>
        <Add fontSize="small" />
      </Fab>
      {contrat && contrat?.contrat.length < 1 ? (
        <p>Loading...</p>
      ) : (
        contrat.contrat.map((index) => {
          return (
            <div key={index._id}>
              <ListeContrat data={index} />
            </div>
          );
        })
      )}
      <Popup open={open} setOpen={setOpen} title="Parametre contrat">
        <AjouterContrat />
      </Popup>
    </div>
  );
}

export default TableContrat;
