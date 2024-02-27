/* eslint-disable react/prop-types */
import Snackbar from '@mui/material/Snackbar';

function DirectionSnackbar(props) {
  const { message, open, setOpen } = props;

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
