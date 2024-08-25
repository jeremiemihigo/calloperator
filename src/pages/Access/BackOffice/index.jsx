import { Typography } from '@mui/material';
import Chip from '@mui/material/Chip';
import ConfirmDialog from 'Control/ControlDialog';
import _ from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import Popup from 'static/Popup';
import Ajouter from './Ajouter';

function Index() {
  const agent = useSelector((state) => _.filter(state.agentAdmin?.agentAdmin, { backOffice_plainte: true }));
  const [confirmDialog, setConfirmDialog] = React.useState({ isOpen: false, title: '', subTitle: '' });
  const [open, setOpen] = React.useState(false);
  const handleDelete = () => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    });
  };
  return (
    <div>
      <Typography
        component="p"
        onClick={() => setOpen(true)}
        style={{
          color: 'blue',
          padding: '0px',
          margin: '10px 0px',
          cursor: 'pointer'
        }}
      >
        Ajoutez un back office
      </Typography>
      {agent.map((item) => {
        return (
          <Chip
            sx={{ margin: '2px' }}
            key={item._id}
            label={item.codeAgent}
            onDelete={() => {
              setConfirmDialog({
                isOpen: true,
                title: `Voulez-vous suppimer cette acces a l'agent ${item.nom}`,
                subTitle: '',
                onConfirm: () => {
                  handleDelete();
                }
              });
            }}
          />
        );
      })}
      <Popup open={open} setOpen={setOpen} title="Back office">
        <Ajouter />
      </Popup>
      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </div>
  );
}

export default React.memo(Index);
