import Popup from 'static/Popup';
import React, { memo } from 'react';
import AddAgent from './Agent';

import { DataGrid } from '@mui/x-data-grid';
import { Fab, Tooltip, Paper } from '@mui/material';
import { Edit, Block, RestartAlt } from '@mui/icons-material';
import DirectionSnackbar from 'Control/SnackBar';
import { useSelector, useDispatch } from 'react-redux';
import ExcelFile from './ExcelFile';
import { Button } from 'antd';
import { BloquerAgent, Reinitialiser } from 'Redux/Agent';

function AgentListe() {
  const [openAgent, setOpenAgent] = React.useState(false);
  const [openAgentUpdate, setOpenAgentUpdate] = React.useState(false);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const allListe = useSelector((state) => state.agent);

  const resetPassword = (agent) => {
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
      headerName: 'Noms',
      width: 200,
      editable: false
    },
    {
      field: 'codeAgent',
      headerName: 'code Agent',
      width: 100,
      editable: false
    },
    {
      field: 'first',
      headerName: 'Log',
      width: 50,
      editable: false,
      renderCell: (params) => {
        return params.row.first ? (
          <p style={{ backgroundColor: 'red', borderRadius: '50%', height: '10px', width: '50%' }}>.</p>
        ) : (
          <p style={{ backgroundColor: 'green', color: 'green', height: '10px', borderRadius: '50%', width: '50%' }}>.</p>
        );
      }
    },
    {
      field: 'region.0.denomination',
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
        return params.row.shop.shop;
      }
    },
    {
      field: 'telephone',
      headerName: 'Téléphone',
      width: 100,
      editable: false
    },
    {
      field: 'fonction',
      headerName: 'Fonction',
      width: 100,
      editable: false,
      renderCell: (params) => {
        return <span style={{ color: `${params.row.active ? 'blue' : 'red'}`, fontWeight: 'bolder' }}>{params.row.fonction}</span>;
      }
    },

    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      editable: false,
      renderCell: (params) => {
        return (
          <p>
            {user?.fonction === 'superUser' && (
              <Tooltip title="Modifiez">
                <Fab color="primary" size="small" onClick={(e) => update(params.row, e)}>
                  <Edit fontSize="small" />
                </Fab>
              </Tooltip>
            )}

            <>
              {allListe.reinitialiser === 'pending' ? (
                <>Wait...</>
              ) : (
                <Tooltip title="Réinitialisez ses accès" sx={{ margin: '10px' }}>
                  <Fab color="success" size="small" onClick={() => resetPassword(params.row)}>
                    <RestartAlt fontSize="small" />
                  </Fab>
                </Tooltip>
              )}
            </>
            {user?.fonction === 'superUser' && (
              <Tooltip title={params.row.active ? 'Bloquer' : 'Débloquer'}>
                <Fab color="warning" size="small" onClick={() => bloquer(params.row)}>
                  {wait === params.row._id ? 'Wait' : <Block fontSize="small" />}
                </Fab>
              </Tooltip>
            )}
          </p>
        );
      }
    }
  ];
  return (
    <Paper elevation={3} sx={{ padding: '5px' }}>
      {user?.fonction === 'superUser' && (
        <div style={{ display: 'flex' }}>
          <div style={{ marginRight: '10px' }}>
            <Button onClick={() => setOpenAgent(true)} type="primary">
              Ajoutez un agent
            </Button>
          </div>
          <ExcelFile />
        </div>
      )}

      {open && <DirectionSnackbar open={open} setOpen={setOpen} message="Opération effectuée" />}

      {allListe.agent && (
        <DataGrid
          rows={allListe.agent}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10
              }
            }
          }}
          pageSizeOptions={[10]}
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
