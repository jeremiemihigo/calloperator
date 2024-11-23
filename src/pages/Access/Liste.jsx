/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { DataGrid } from '@mui/x-data-grid';
import DirectionSnackbar from 'Control/SnackBar';
import { Button } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { config, lien } from 'static/Lien';
import Popup from 'static/Popup';
import AgentAdmin from './AgentAdmin';

import Dot from 'components/@extended/Dot';
import { returnRole } from 'utils/Lien';
import { Delete, Edit, ResetTvOutlined } from '../../../node_modules/@mui/icons-material/index';
import { Fab, Tooltip } from '../../../node_modules/@mui/material/index';
import UpdateAgentAdmin from './UpdateAgentAdmin';

function AgentListeAdmin() {
  const userAdmin = useSelector((state) => state.agentAdmin?.agentAdmin);
  const [agentEdit, setAgentEdit] = React.useState();
  const [openEdit, setOpenEdit] = React.useState(false);
  const role = useSelector((state) => state.role.role);
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
  const clickEdit = (agent) => {
    setAgentEdit(agent);
    setOpenEdit(true);
  };

  const columns = [
    {
      field: 'codeAgent',
      headerName: 'Code',
      width: 120,
      editable: false
    },
    {
      field: 'nom',
      headerName: 'NOMS',
      width: 200,
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
      field: 'role',
      headerName: 'Role',
      width: 150,
      editable: false,
      renderCell: (params) => {
        return returnRole(role, params.row.role);
      }
    },
    {
      field: 'reset',
      headerName: 'Reset',
      width: 200,
      editable: false,
      renderCell: (params) => {
        return (
          <>
            <Tooltip title="Reset password">
              <Fab color="primary" size="small" onClick={() => resetPassword(params.row)}>
                <ResetTvOutlined fontSize="small" />
              </Fab>
            </Tooltip>
            <Tooltip title="Edit">
              <Fab onClick={() => clickEdit(params.row)} color="info" size="small" sx={{ margin: '0px 10px' }}>
                <Edit fontSize="small" />
              </Fab>
            </Tooltip>
            <Tooltip title={params.row.active ? 'Blocked' : 'Unblocked'}>
              <Fab color="warning" size="small" onClick={() => bloquerAgent(params.row)}>
                <Delete fontSize="small" />
              </Fab>
            </Tooltip>
          </>
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
        {userAdmin && role && (
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
      {agentEdit && (
        <Popup open={openEdit} setOpen={setOpenEdit} title={`Modification de l'agent ${agentEdit?.nom}`}>
          <UpdateAgentAdmin agent={agentEdit} />
        </Popup>
      )}
    </div>
  );
}

export default AgentListeAdmin;
