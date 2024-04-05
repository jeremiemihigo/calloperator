import axios from 'axios';
import AddZone from './AddZone';
import { lien, config } from 'static/Lien';
import { useEffect, useState } from 'react';
import { Details, Edit } from '@mui/icons-material';
import { Fab, Paper } from '@mui/material';
import Popup from 'static/Popup';
import AgentListe from '../Agent/AgentListe';
import { DataGrid } from '@mui/x-data-grid';
import Shop from './Shop';
import { useSelector } from 'react-redux';
import { Button } from 'antd';

function Region() {
  const [data, setData] = useState();
  const [openShop, setOpenShop] = useState(false);
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
  const shop = useSelector((state) => state.shop.shop);
  const user = useSelector((state) => state.user.user);
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
  const columnsShop = [
    {
      field: 'region',
      headerName: 'REGION',
      width: 80,
      editable: false,
      renderCell: (params) => {
        return params.row.region.denomination;
      }
    },
    {
      field: 'idShop',
      headerName: 'ID SHOP',
      width: 100,
      editable: false
    },
    {
      field: 'shop',
      headerName: 'SHOP',
      width: 100,
      editable: false
    },
    {
      field: 'tech',
      headerName: 'Techniciens',
      width: 70,
      editable: false
    },
    {
      field: 'agents',
      headerName: 'Agents',
      width: 70,
      editable: false
    },
    {
      field: 'detail',
      headerName: 'Actions',
      width: 70,
      editable: false,
      renderCell: () => {
        return <Edit fontSize="small" color="primary" />;
      }
    }
  ];
  return (
    <Paper elevation={3} sx={{ padding: '10px' }}>
      {user?.fonction === 'superUser' && <AddZone />}

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
        <div style={{ width: '50%' }}>
          {user?.fonction === 'superUser' && (
            <Button type="primary" onClick={() => setOpenShop(true)}>
              Ajoutez un shop
            </Button>
          )}

          {shop && (
            <DataGrid
              rows={shop}
              columns={columnsShop}
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
        {/* <div>
          <Shop />
        </div> */}
      </div>

      {donner && (
        <Popup open={open} setOpen={setOpen} title={`Région ${donner.denomination}`}>
          <AgentListe liste={donner} />
        </Popup>
      )}
      <Popup open={openShop} setOpen={setOpenShop} title="Ajoutez un shop">
        <Shop />
      </Popup>
    </Paper>
  );
}

export default Region;
