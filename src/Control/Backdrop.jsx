/* eslint-disable react/prop-types */
import { Backdrop, CircularProgress, Paper } from '@mui/material';
import PropTypes from 'prop-types';

function SimpleBackdrop({ open, title, taille }) {
  return (
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 100 }} open={open}>
      <Paper sx={{ width: taille || '7rem', display: 'flex', padding: '10px', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <CircularProgress size={15} color="primary" />
          <p style={{ fontSize: '12px' }}>{title || 'Laading...'}</p>
        </div>
      </Paper>
    </Backdrop>
  );
}
SimpleBackdrop.propTypes = {
  open: PropTypes.bool,
  taille: PropTypes.string,
  title: PropTypes.string
};
export default SimpleBackdrop;
