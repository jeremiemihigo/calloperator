/* eslint-disable react/prop-types */
import Snackbar from '@mui/material/Snackbar';
import React from 'react';

function DirectionSnackbar(props) {
  const { message } = props;
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={open}
        onClose={handleClose}
        message={message}
        key="bottom center"
      />
    </div>
  );
}
export default DirectionSnackbar;
