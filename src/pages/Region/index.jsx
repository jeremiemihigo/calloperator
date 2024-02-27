import axios from 'axios';
import AddZone from './AddZone';
import { lien, config } from 'static/Lien';
import { useEffect, useState } from 'react';
import { Details } from '@mui/icons-material';
import { Fab, Paper } from '@mui/material';
import Popup from 'static/Popup';
import AgentListe from '../Agent/AgentListe';
import { DataGrid } from '@mui/x-data-grid';
import Chats from 'pages/Region/Chat';

function Region() {
  const [data, setData] = useState();
  const loading = async () => {
    const response = await axios.get(lien + '/zone', config);
    setData(response.data);
  };
  useEffect(() => {
    loading();
  }, []);
  const [open, setOpen] = useState(false);
  const [donner, setdonner] = useState(false);
  const functionListe = (donne) => {
    setdonner(donne);
    setOpen(true);
  };
  const columns = [
    {
      field: 'idZone',
      headerName: 'ID_Region',
      width: 100,
      editable: false
    },
    {
      field: 'denomination',
      headerName: 'REGION',
      width: 150,
      editable: false
    },
    {
      field: 'agent',
      headerName: 'SA',
      width: 70,
      editable: false,
      renderCell: (params) => {
        return <span>{params.row.agentListe.length}</span>;
      }
    },
    {
      field: 'tech',
      headerName: 'TECH',
      width: 70,
      editable: false,
      renderCell: (params) => {
        return <span>{params.row.techListe.length}</span>;
      }
    },
    {
      field: 'detail',
      headerName: 'Détails',
      width: 70,
      editable: false,
      renderCell: (params) => {
        return (
          <Fab color="primary" size="small" onClick={() => functionListe(params.row)}>
            <Details fontSize="small" />
          </Fab>
        );
      }
    }
  ];
  return (
    <Paper elevation={3} sx={{ padding: '10px' }}>
      <AddZone />
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%' }}>
          {data && (
            <DataGrid
              rows={data}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 6
                  }
                }
              }}
              pageSizeOptions={[6]}
              checkboxSelection
              disableRowSelectionOnClick
            />
          )}
        </div>
        <div>
          <Chats />
        </div>
      </div>

      {donner && (
        <Popup open={open} setOpen={setOpen} title={`Région ${donner.denomination}`}>
          <AgentListe liste={donner} />
        </Popup>
      )}
    </Paper>
  );
}

export default Region;
