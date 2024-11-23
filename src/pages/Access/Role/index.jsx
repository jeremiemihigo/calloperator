import { Add } from '@mui/icons-material';
import { Fab, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';
import { useSelector } from 'react-redux';
import Popup from 'static/Popup';
import Formulaire from './Formulaire';

function Index() {
  const [open, setOpen] = React.useState(false);
  const role = useSelector((state) => state.role.role);
  const columns = [
    {
      field: 'idRole',
      headerName: 'ID',
      width: 100,
      editable: false
    },
    {
      field: 'title',
      headerName: 'Role',
      width: 180,
      editable: false
    },
    {
      field: 'filterBy',
      headerName: 'filterBy',
      width: 120,
      editable: false
    }
  ];
  function getId(row) {
    return row._id;
  }
  return (
    <>
      <Paper elevation={3} sx={{ padding: '10px' }}>
        <Fab onClick={() => setOpen(true)} size="small" color="primary">
          <Add fontSize="small" />
        </Fab>
      </Paper>
      <Paper elevation={0} sx={{ padding: '10px', marginTop: '10px' }}>
        {role && role.length > 0 && (
          <div>
            <DataGrid
              rows={role}
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
              getRowId={getId}
              disableRowSelectionOnClick
            />
          </div>
        )}
      </Paper>
      <Popup open={open} setOpen={setOpen} title="Add">
        <Formulaire />
      </Popup>
    </>
  );
}

export default Index;
