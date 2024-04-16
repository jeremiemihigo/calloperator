import React from 'react';
import { Fab, Grid, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import Popup from 'static/Popup';
import Departement from './Form/Departement';
import RoleForm from './Form/Role';
import { lien } from 'static/Lien';
import axios from 'axios';
import '../style.css';
import { useSelector } from 'react-redux';
import AutoComplement from 'Control/AutoComplet';
import ConfirmDialog from 'Control/ControlDialog';

function Role() {
  const [addDepartementOpen, setAddDepartement] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState();
  const loading = async () => {
    const response = await axios.get(lien + '/permission');
    setData(response.data);
  };
  React.useEffect(() => {
    loading();
  }, []);
  const [selected, setSelected] = React.useState('');
  const agentAdmin = useSelector((state) => state.agentAdmin);
  const [value, setValue] = React.useState('');

  const [confirmDialog, setConfirmDialog] = React.useState({ isOpen: false, title: '', subTitle: '' });
  const sendParametre = async () => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    });
    const response = await axios.put(lien + '/addTache', { codeAgent: value?.codeAgent, tache: selected });
    console.log(response);
  };
  return (
    <div>
      <Fab onClick={() => setAddDepartement(true)} color="primary" size="small" sx={{ marginRight: '10px' }}>
        <Add fontSize="small" />
      </Fab>

      <Fab onClick={() => setOpen(true)} color="primary" size="small">
        <Add fontSize="small" />
      </Fab>
      <Grid container>
        <Grid item lg={6}>
          <div style={{ marginTop: '10px' }}>
            {!data ? (
              <p style={{ textAlign: 'center', color: 'blue', fontSize: '12px' }}>Loading...</p>
            ) : (
              <table>
                <tbody>
                  {data.map((index) => {
                    return (
                      <tr key={index._id}>
                        <td colSpan={'' + index.department.length}>{index.departement}</td>
                        <td>
                          <ol>
                            {index.department.map((item) => {
                              return (
                                <Typography
                                  component="li"
                                  onClick={() => setSelected(item.id)}
                                  sx={{ cursor: 'pointer', color: `${selected === item.id ? 'blue' : 'black'}` }}
                                  key={item._id}
                                >
                                  {item.title}
                                </Typography>
                              );
                            })}
                          </ol>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </Grid>
        <Grid item lg={6}>
          <div style={{ margin: '10px 0px' }}>
            <AutoComplement value={value} setValue={setValue} options={agentAdmin?.agentAdmin} title="Selectionnez un agent" propr="nom" />
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setConfirmDialog({
                  isOpen: true,
                  title: 'Confirmer la suppression',
                  subTitle: 'Supprimer',
                  onConfirm: () => {
                    sendParametre();
                  }
                });
              }}
            >
              Valider
            </Button>
          </div>
        </Grid>
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
