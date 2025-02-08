import { Block, Edit, RestartAlt } from '@mui/icons-material';
import { Button, CircularProgress, Fab, Grid, Paper, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DirectionSnackbar from 'Control/SnackBar';
import { BloquerAgent, Reinitialiser } from 'Redux/Agent';
import Dot from 'components/@extended/Dot';
import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ExcelButton from 'static/ExcelButton';
import Popup from 'static/Popup';
import AddAgent from './Agent';

function AgentListe() {
  const [openAgent, setOpenAgent] = React.useState(false);
  const [openAgentUpdate, setOpenAgentUpdate] = React.useState(false);
  const dispatch = useDispatch();

  const allListe = useSelector((state) => state.agent);
  const [agentReset, setAgentReset] = React.useState();
  const resetPassword = (agent) => {
    setAgentReset(agent._id);
    dispatch(Reinitialiser({ id: agent._id }));
  };
  const [dataTo, setDataTo] = React.useState();
  const update = (donner, e) => {
    e.preventDefault();
    setDataTo(donner);
    setOpenAgentUpdate(true);
  };
  const [wait, setWait] = React.useState('');
  const bloquer = (agent) => {
    setWait(agent._id);
    let data = { id: agent._id, value: !agent.active };
    dispatch(BloquerAgent(data));
    setWait('');
  };
  const user = useSelector((state) => state.user?.user);

  const columns = [
    {
      field: 'nom',
      headerName: 'Full name',
      width: 200,
      editable: false
    },
    {
      field: 'codeAgent',
      headerName: 'ID Agent',
      width: 100,
      editable: false
    },
    {
      field: 'first',
      headerName: 'Log',
      width: 50,
      editable: false,
      renderCell: (params) => {
        return params.row.first ? <Dot color="error" /> : <Dot color="success" />;
      }
    },
    {
      field: 'region',
      headerName: 'Region',
      width: 100,
      editable: false,
      renderCell: (params) => {
        return params.row.region.denomination;
      }
    },
    {
      field: 'shop',
      headerName: 'Shop',
      width: 100,
      editable: false,
      renderCell: (params) => {
        return params.row.shop[0]?.shop;
      }
    },
    {
      field: 'telephone',
      headerName: 'Contact number',
      width: 100,
      editable: false
    },
    {
      field: 'fonction',
      headerName: 'Function',
      width: 90,
      editable: false,
      renderCell: (params) => {
        return <span style={{ color: `${params.row.active ? 'blue' : 'red'}`, fontWeight: 'bolder' }}>{params.row.fonction}</span>;
      }
    },
    {
      field: 'pass',
      headerName: 'Default password',
      width: 100,
      editable: false,
      renderCell: (params) => {
        return <span>{params.row.first ? params.row.pass : 'Just edited'}</span>;
      }
    },

    {
      field: 'action',
      headerName: 'Edit; Reset; Bloc account',
      width: 180,
      editable: false,
      renderCell: (params) => {
        return (
          <>
            {user?.fonction === 'superUser' && (
              <Tooltip title="Modifiez">
                <Fab color="primary" size="small" onClick={(e) => update(params.row, e)}>
                  <Edit fontSize="small" />
                </Fab>
              </Tooltip>
            )}

            <div style={{ margin: '10px' }}>
              {allListe.reinitialiser === 'pending' && params.row._id === agentReset ? (
                <Fab color="primary" size="small">
                  <CircularProgress size={15} color="inherit" />
                </Fab>
              ) : (
                <Tooltip title="Réinitialisez ses accès">
                  <Fab color="success" size="small" onClick={() => resetPassword(params.row)}>
                    <RestartAlt fontSize="small" />
                  </Fab>
                </Tooltip>
              )}
            </div>
            {user?.fonction === 'superUser' && (
              <Tooltip title={params.row.active ? 'Bloquer' : 'Débloquer'}>
                <Fab color="warning" size="small" onClick={() => bloquer(params.row)}>
                  {wait === params.row._id ? 'Wait' : <Block fontSize="small" />}
                </Fab>
              </Tooltip>
            )}
          </>
        );
      }
    }
  ];

  const [open, setOpen] = React.useState(false);

  return (
    <Paper elevation={3} sx={{ padding: '5px' }}>
      {allListe.reinitialiser === 'success' && agentReset && (
        <DirectionSnackbar message={`Reinitialisation effectuée ${agentReset}`} open={open} setOpen={setOpen} />
      )}

      {user?.fonction === 'superUser' && (
        <Grid container>
          <Grid item lg={2} xs={6} sx={{ padding: '5px' }}>
            <div>
              <Button fullWidth onClick={() => setOpenAgent(true)} variant="contained" color="primary">
                Ajoutez_un_agent
              </Button>
            </div>
          </Grid>
          <Grid item lg={2} xs={6} sx={{ padding: '5px' }}>
            <div>{allListe && <ExcelButton data={allListe.agent} title="Export to excel" fileName="agents.xlsx" />}</div>
          </Grid>

          {/* <ExcelFile /> */}
        </Grid>
      )}

      {allListe.agent && (
        <DataGrid
          rows={allListe.agent}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 50
              }
            }
          }}
          pageSizeOptions={[50]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      )}

      <Popup open={openAgent} setOpen={setOpenAgent} title="Ajoutez un agent">
        <AddAgent />
      </Popup>
      <Popup open={openAgentUpdate} setOpen={setOpenAgentUpdate} title="Modifier l'agent">
        <AddAgent data={dataTo} />
      </Popup>
    </Paper>
  );
}

export default memo(AgentListe);
