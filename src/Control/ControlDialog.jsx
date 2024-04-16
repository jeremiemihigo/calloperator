/* eslint-disable react/prop-types */
import React from 'react';
import { Dialog, DialogContent, DialogActions, Typography } from '@mui/material';
import { Button } from 'antd';

export default function ConfirmDialog(props) {
  const { confirmDialog, setConfirmDialog } = props;

  return (
    <Dialog open={confirmDialog.isOpen} className={classes.dialog}>
      <DialogContent className={classes.contentDialog}>
        <Typography variant="h6">{confirmDialog.title}</Typography>
        <Typography variant="subtitle2">{confirmDialog.subTitle}</Typography>
      </DialogContent>
      <DialogActions className={classes.contentButton}>
        <Button type="primary" onClick={confirmDialog.onConfirm}>
          Yes
        </Button>
        <Button type="primary" danger onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}>
          No
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
