import { Button, Grid } from '@mui/material';
import AutoComplement from 'Control/AutoComplet';
import ConfirmDialog from 'Control/ControlDialog';
import axios from 'axios';
import React from 'react';
import { useSelector } from 'react-redux';
import { lien } from 'static/Lien';
import Popup from 'static/Popup';
import '../style.css';
import Departement from './Form/Departement';
import RoleForm from './Form/Role';

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
    if (response) {
      window.location.replace('/access');
    }
  };

  const table = [{ id: 31660, title: 'SUPPORT' }];
  return (
    <div>
      <Grid container>
        <Grid item lg={6}>
          <div style={{ marginTop: '10px' }}>
            {!data ? (
              <p style={{ textAlign: 'center', color: 'blue', fontSize: '12px' }}>Loading...</p>
            ) : (
              <>
                {table.map((index) => {
                  return (
                    <Grid
                      key={index.id}
                      onClick={() => setSelected(index.id)}
                      className={selected === index.id ? 'selected' : 'notSelected'}
                    >
                      <p>{index.title}</p>
                    </Grid>
                  );
                })}
                {/* <table>
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
                </table> */}
              </>
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
                  title: 'Cette opération donne la permission de répondre aux demandes des SA & TECH',
                  subTitle: "Cliquez sur YES pour valider l'operation",
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
