import { Button, CircularProgress, TextField } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AjouterZone } from 'Redux/Zone';
import DirectionSnackbar from 'Control/SnackBar';

function AddAgent() {
  const [denomination, setDenomination] = useState('');
  const dispatch = useDispatch();
  const zone = useSelector((state) => state.zone);
  const [open, setOpen] = useState(false);
  const send = (e) => {
    e.preventDefault();
    try {
      dispatch(AjouterZone(denomination));
      setOpen(true);
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };

  return (
    <div style={{ padding: '10px', width: '20rem' }}>
      {zone.addZone === 'rejected' && <DirectionSnackbar message={zone.addZoneError} open={open} setOpen={setOpen} />}
      {zone.addZone === 'success' && <DirectionSnackbar message="Enregistrement effectuer" open={true} setOpen={setOpen} />}

      <div style={{ display: 'flex' }}>
        <TextField
          onChange={(e) => {
            e.preventDefault();
            setDenomination(e.target.value);
          }}
          value={denomination}
          label="Dénomination"
          name="etablissement"
          autoComplete="off"
          fullWidth
        />
        <Button
          sx={{ marginLeft: '10px' }}
          variant="contained"
          disabled={zone.addZone === 'pending' ? true : false}
          onClick={(e) => send(e)}
        >
          {zone.addZone === 'pending' && <CircularProgress color="inherit" size={20} />}

          <span style={{ marginLeft: '10px' }}>Enregistrer</span>
        </Button>
      </div>
    </div>
  );
}

export default AddAgent;
