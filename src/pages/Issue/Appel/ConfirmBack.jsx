/* eslint-disable react/prop-types */
import { Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { Button } from 'antd';

export default function ConfirmBackOffice(props) {
  const { confirmDialog } = props;
  const { onConfirm } = confirmDialog;
  const taille = '7rem';

  return (
    <Dialog open={confirmDialog.isOpen} sx={classes.dialog}>
      <DialogContent style={classes.contentDialog}>
        <Typography variant="h6">{confirmDialog.title}</Typography>
      </DialogContent>

      <DialogActions sx={classes.contentButton}>
        <Button style={{ width: taille }} type="primary" onClick={() => onConfirm('hight')}>
          Hight
        </Button>
        <Button style={{ width: taille }} type="primary" danger onClick={() => onConfirm('moyenne')}>
          Moyenne
        </Button>
        <Button style={{ width: taille }} type="primary" danger onClick={() => onConfirm('low')}>
          Low
        </Button>
      </DialogActions>
    </Dialog>
  );
}
const classes = {
  dialog: {
    padding: '5px',
    position: 'absolute',
    top: '5px'
  },
  contentDialog: {
    textAlign: 'center',
    width: '20rem'
  },
  contentButton: {
    justifyContent: 'center'
  }
};
