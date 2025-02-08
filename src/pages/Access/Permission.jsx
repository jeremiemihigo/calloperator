import { Grid } from '@mui/material';
import ConfirmDialog from 'Control/ControlDialog';
import React from 'react';
import Popup from 'static/Popup';
import '../style.css';
import BackOffice from './BackOffice';
import Departement from './Form/Departement';
import RoleForm from './Form/Role';
import PlainteCallCenter from './PlainteCallCenter';
import PlainteShop from './PlainteShop';
import SychroTeam from './SynchroTeam';

function Role() {
  const [addDepartementOpen, setAddDepartement] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const [selected, setSelected] = React.useState('');
  // const agentAdmin = useSelector((state) => state.agentAdmin);
  // const [value, setValue] = React.useState('');

  const [confirmDialog, setConfirmDialog] = React.useState({ isOpen: false, title: '', subTitle: '' });
  // const sendParametre = async () => {
  //   setConfirmDialog({
  //     ...confirmDialog,
  //     isOpen: false
  //   });
  //   const response = await axios.put(lien + '/addTache', { codeAgent: value?.codeAgent, tache: selected });
  //   if (response) {
  //     window.location.replace('/access');
  //   }
  // };

  const table = [
    { id: '31660', title: 'SUPPORT TEAM' },
    { id: '31661', title: 'ENREGISTREMENT DES PLAINTES (shop)' },
    { id: '31663', title: 'ENREGISTREMENT DES PLAINTES (call center)' },
    { id: '31662', title: 'BACK OFFICE (plainte)' },
    { id: '31664', title: 'SYNCHRO TEAM' }
  ];
  return (
    <div>
      <Grid container>
        <Grid item lg={4}>
          <div style={{ marginTop: '10px' }}>
            {table.map((index) => {
              return (
                <Grid
                  sx={{ marginBottom: '10px' }}
                  key={index.id}
                  onClick={() => setSelected(index.id)}
                  className={selected === index.id ? 'selected' : 'notSelected'}
                >
                  <p style={{ padding: '0px', margin: '0px' }}>{index.title}</p>
                </Grid>
              );
            })}
          </div>
        </Grid>
        {selected === '31661' && (
          <Grid item lg={8}>
            <PlainteShop />
          </Grid>
        )}
        {selected === '31662' && (
          <Grid item lg={8}>
            <BackOffice />
          </Grid>
        )}
        {selected === '31663' && (
          <Grid item lg={8}>
            <PlainteCallCenter />
          </Grid>
        )}
        {selected === '31664' && (
          <Grid item lg={8}>
            <SychroTeam />
          </Grid>
        )}
        {selected === '31660' && (
          <Grid item lg={8}>
            <p style={{ textAlign: 'center', fontSize: '25px', padding: '0px', margin: '0px' }}>For all call operator or super user</p>
          </Grid>
        )}
      </Grid>

      <Popup open={addDepartementOpen} setOpen={setAddDepartement} title="Département">
        <Departement />
      </Popup>
      <Popup open={open} setOpen={setOpen} title="Role">
        <RoleForm />
      </Popup>
      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </div>
  );
}

export default Role;
