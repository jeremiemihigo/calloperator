import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { Fab } from '@mui/material';

function Tables() {
  const data = useSelector((state) => state.raison?.raison);
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100,
      editable: false
    },

    {
      field: 'raison',
      headerName: 'Raison',
      width: 200,
      editable: false
    },

    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      editable: false,
      renderCell: (params) => {
        console.log(params);
        return (
          <>
            <Fab size="small" color="primary">
              <Edit fontSize="small" />
            </Fab>
            <Fab size="small" color="secondary">
              <Delete fontSize="small" />
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
    </div>
  );
}

export default Tables;
