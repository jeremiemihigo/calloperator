import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Edit } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { Fab } from '@mui/material';
import Popup from 'static/Popup';
import FormRaison from './FormRaison';

function Tables() {
  const data = useSelector((state) => state.raison?.raison);
  const [open, setOpen] = React.useState(false);
  const [dataUpdate, setData] = React.useState({ id: null, raison: null, type: '' });

  const functionOpen = (e, raison) => {
    e.preventDefault();
    setData({ id: raison._id, raison: raison.raison, type: raison.type });
    setOpen(true);
  };
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 150,
      editable: false
    },

    {
      field: 'raison',
      headerName: 'Raison',
      width: 300,
      editable: false
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
      editable: false
    },

    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      editable: false,
      renderCell: (params) => {
        return (
          <>
            <Fab onClick={(e) => functionOpen(e, params.row)} size="small" color="primary" sx={{ marginRight: '10px' }}>
              <Edit fontSize="small" />
            </Fab>
          </>
        );
      }
    }
  ];
  return (
    <div>
      {data && (
        <DataGrid
          rows={data}
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
      {dataUpdate.raison !== null && (
        <Popup open={open} setOpen={setOpen} title="Modifier le feedback">
          <FormRaison id={dataUpdate.id} raisonUpdate={dataUpdate.raison} type={dataUpdate.type} />
        </Popup>
      )}
    </div>
  );
}

export default Tables;
