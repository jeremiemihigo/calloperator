/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DirectionSnackbar from 'Control/SnackBar';
import { Button } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { config, lien } from 'static/Lien';
import Popup from 'static/Popup';
import AgentAdmin from './AgentAdmin';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Dot from 'components/@extended/Dot';

function AgentListeAdmin() {
  const userAdmin = useSelector((state) => state.agentAdmin?.agentAdmin);
  const [open, setOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [message, setMessage] = useState('');

  const bloquerAgent = async (agent) => {
    const response = await axios.put(lien + '/bloquerAgentAdmin', { id: agent._id, value: !agent.active }, config);
    if (response.status === 200) {
      window.location.replace('/access');
    } else {
      setMessage('' + response.data);
      setOpen(true);
    }
  };
  const resetPassword = async (agent) => {
    const response = await axios.put(lien + '/resetAdmin', { id: agent._id }, config);
    if (response.status === 200) {
      window.location.replace('/access');
    } else {
      setMessage('' + response.data);
      setOpen(true);
    }
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
      field: 'first',
      headerName: 'Log',
      width: 50,
      editable: false,
      renderCell: (params) => {
        return params.row.first ? <Dot color="error" /> : <Dot color="success" />;
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
            <Typography sx={{ cursor: 'pointer' }} onClick={() => resetPassword(params.row)} className="cursor-pointer">
              Reset
            </Typography>
          </>
        );
      }
    },
    {
      field: 'paswo',
      headerName: 'Bloquer',
      width: 80,
      editable: false,
      renderCell: (params) => {
        return (
          <>
            <Typography sx={{ cursor: 'pointer' }} onClick={() => bloquerAgent(params.row)} className="cursor-pointer">
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
            {params.row?.tache?.map((index) => {
              return <Chip key={index._id} label={index.title} />;
            })}
          </Stack>
        );
      }
    }
  ];

  return (
    <div style={{ padding: '5px' }}>
      {open && message !== '' && <DirectionSnackbar open={open} setOpen={setOpen} message={message} />}
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
