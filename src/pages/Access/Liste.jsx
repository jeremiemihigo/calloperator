/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { lien } from 'static/Lien';
import { useState } from 'react';
import DirectionSnackbar from 'Control/SnackBar';
import { Typography } from '@mui/material';
import { config } from 'static/Lien';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import Popup from 'static/Popup';
import AgentAdmin from './AgentAdmin';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

function AgentListeAdmin() {
  const userAdmin = useSelector((state) => state.agentAdmin?.agentAdmin);
  const [open, setOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const resetPassword = (agent) => {
    axios.put(lien + '/reset', { id: agent._id }, config).then((result) => {
      if (result.status === 200) {
        setOpen(true);
      }
    });
  };

  const columns = [
    {
      field: 'codeAgent',
      headerName: 'Code',
      width: 80,
      editable: false
    },
    {
      field: 'nom',
      headerName: 'NOMS',
      width: 150,
      editable: false
    },

    {
      field: 'departement',
      headerName: 'Departement',
      width: 50,
      editable: false,
      renderCell: (params) => {
        return params.row.departements.length > 0 ? params.row.departements[0].departement : '';
      }
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
      field: 'reset',
      headerName: 'Reset',
      width: 50,
      editable: false,
      renderCell: (params) => {
        return (
          <>
            <Typography sx={{ cursor: 'pointer', color: 'green' }} onClick={() => resetPassword(params.row)} className="cursor-pointer">
              Reset
            </Typography>
          </>
        );
      }
    },
    {
      field: 'paswo',
      headerName: 'Bloquer',
      width: 60,
      editable: false,
      renderCell: (params) => {
        return (
          <>
            <Typography sx={{ cursor: 'pointer', color: 'red' }} onClick={() => resetPassword(params.row)} className="cursor-pointer">
              {params.row.active ? 'Bloquer' : 'Débloquer'}
            </Typography>
          </>
        );
      }
    },
    {
      field: 'Taches',
      headerName: 'Tâches',
      width: 500,
      editable: false,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={1} sx={{ marginRight: '5px' }}>
            {params.row?.tache.map((index) => {
              return <Chip key={index._id} label={index.title} />;
            })}
          </Stack>
        );
      }
    }
  ];

  return (
    <div style={{ padding: '5px' }}>
      {open && <DirectionSnackbar open={open} setOpen={setOpen} message="Opération effectuée" />}
      <Button type="primary" onClick={() => setOpenForm(true)}>
        Ajoutez un agent
      </Button>
      <div>
        {userAdmin && (
          <DataGrid
            rows={userAdmin}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 7
                }
              }
            }}
            pageSizeOptions={[7]}
          />
        )}
      </div>
      <Popup open={openForm} setOpen={setOpenForm} title="Agent">
        <AgentAdmin />
      </Popup>
    </div>
  );
}

export default AgentListeAdmin;
