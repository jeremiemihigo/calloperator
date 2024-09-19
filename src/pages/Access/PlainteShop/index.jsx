import { Add } from '@mui/icons-material';
import { Fab, Tooltip } from '@mui/material';
import Chip from '@mui/material/Chip';
import { DataGrid } from '@mui/x-data-grid';
import ConfirmDialog from 'Control/ControlDialog';
import _ from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import Popup from 'static/Popup';
import Form from './Form';

function Index() {
  const [open, setOpen] = React.useState(false);
  const shop = useSelector((state) => state.shop?.shop);
  const agent = useSelector((state) => state.agentAdmin?.agentAdmin);
  const [data, setData] = React.useState();

  const findAll = (shop) => {
    return _.filter(agent, { plainteShop: shop });
  };

  const loading = () => {
    try {
      let table = [];
      for (let i = 0; i < shop.length; i++) {
        table.push({
          id: i,
          shop: shop[i].shop,
          agent: findAll(shop[i].shop)
        });
      }
      setData(table);
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loading();
  }, [agent, shop]);

  const [confirmDialog, setConfirmDialog] = React.useState({ isOpen: false, title: '', subTitle: '' });

  const handleDelete = () => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    });
  };
  const columns = [
    {
      field: 'shop',
      headerName: 'Shop',
      width: 100,
      editable: false
    },
    {
      field: 'agent',
      headerName: 'Agent',
      width: 500,
      editable: false,
      renderCell: (params) => {
        return (
          <>
            {params.row.agent.map((item) => {
              return (
                <Chip
                  sx={{ margin: '2px' }}
                  key={item._id}
                  label={item.codeAgent}
                  onDelete={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: `Voulez-vous suppimer cette acces a l'agent ${item.nom}`,
                      subTitle: '',
                      onConfirm: () => {
                        handleDelete();
                      }
                    });
                  }}
                />
              );
            })}
          </>
        );
      }
    }
  ];

  return (
    <div>
      <Tooltip title="Renseigner un agent">
        <Fab size="small" color="primary" onClick={() => setOpen(true)}>
          <Add fontSize="small" />
        </Fab>
      </Tooltip>
      <div>
        {data && (
          <DataGrid
            rows={data}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 20
                }
              }
            }}
            pageSizeOptions={[20]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        )}
      </div>

      <Popup open={open} setOpen={setOpen} title="Shop">
        <Form />
      </Popup>
      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </div>
  );
}

export default Index;
