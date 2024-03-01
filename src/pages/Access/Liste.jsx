/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { lien } from 'static/Lien';
import { useEffect, useState } from 'react';
import DirectionSnackbar from 'Control/SnackBar';
import { Typography, Grid } from '@mui/material';
import { config } from 'static/Lien';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import Popup from 'static/Popup';
import AgentAdmin from './AgentAdmin';
import Chats from './Chat';
import _ from 'lodash';

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
  const [series, setSeries] = useState();
  const seach = () => {
    let series = [];
    series.push(_.filter(userAdmin, { fonction: 'superUser' }).length);
    series.push(_.filter(userAdmin, { fonction: 'admin' }).length);
    series.push(_.filter(userAdmin, { fonction: 'co' }).length);
    setSeries(series);
  };
  useEffect(() => {
    seach();
  }, [userAdmin]);

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
      field: 'telephone',
      headerName: 'Telephone',
      width: 100,
      editable: false
    },
    {
      field: 'fonction',
      headerName: 'Fonction',
      width: 90,
      editable: false
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
    }
  ];

  return (
    <div style={{ padding: '5px' }}>
      {open && <DirectionSnackbar open={open} setOpen={setOpen} message="Opération effectuée" />}
      <Button type="primary" onClick={() => setOpenForm(true)}>
        Ajoutez un agent
      </Button>
      <Grid container>
        <Grid item lg={7}>
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
              checkboxSelection
              disableRowSelectionOnClick
            />
          )}
        </Grid>
        <Grid item lg={5}>
          {series && <Chats series={series} />}
        </Grid>
      </Grid>
      <Popup open={openForm} setOpen={setOpenForm} title="Agent">
        <AgentAdmin />
      </Popup>
    </div>
  );
}

export default AgentListeAdmin;
