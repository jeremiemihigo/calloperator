import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { config, lien } from 'static/Lien';
import Popup from 'static/Popup';
import AddZone from './AddZone';
import Shop from './Shop';

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

      <Popup open={openShop} setOpen={setOpenShop} title="Ajoutez un shop">
        <Shop />
      </Popup>
    </Paper>
  );
}

export default Region;
