import { Details } from '@mui/icons-material';
import { Fab, Paper, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import FullScreenDialog from 'Control/FullDialog';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import AddProjet from './AddProjet';
import { CreateContextServey } from './Context';

function Page() {
  const [open, setOpen] = React.useState(false);
  const projet = useSelector((state) => state.projet.projet);
  const { projetselect, setProjetSelect } = React.useContext(CreateContextServey);
  const addquestion = (id) => {
    setProjetSelect(id);
    setOpen(true);
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      editable: false
    },
    {
      field: 'encours',
      headerName: 'Fin projet',
      width: 100,
      editable: false,
      renderCell: (params) => {
        return moment(params.row.date).fromNow();
      }
    },
    {
      field: 'intervenant',
      headerName: 'Intervenant',
      width: 70,
      editable: false,
      renderCell: (params) => {
        return params.row?.intervenant.length;
      }
    },
    {
      field: 'clients',
      headerName: 'Clients',
      width: 100,
      editable: false,
      renderCell: (params) => {
        return params.row?.customers.length;
      }
    },
    {
      field: 'details',
      headerName: 'Option',
      width: 70,
      editable: false,
      renderCell: (params) => {
        return (
          <Fab onClick={() => addquestion(params.row)} size="small" color="primary">
            <Details fontSize="small" />
          </Fab>
        );
      }
    }
  ];
  function getRowId(p) {
    return p._id;
  }
  return (
    <>
      <Paper elevation={4} sx={{ padding: '10px', cursor: 'pointer', color: 'blue', fontWeight: 'bolder' }}>
        <Typography
          onClick={() => {
            setProjetSelect();
            setOpen(true);
          }}
          style={{ padding: '0px', margin: '0px' }}
        >
          Add a survey
        </Typography>
      </Paper>
      <Paper sx={{ marginTop: '10px' }}>
        {projet && (
          <DataGrid
            rows={projet}
            columns={columns}
            getRowId={getRowId}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10
                }
              }
            }}
            pageSizeOptions={[10]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        )}
      </Paper>
      <FullScreenDialog open={open} setOpen={setOpen} title={projetselect ? projetselect.name : 'Add a project'}>
        <AddProjet />
      </FullScreenDialog>
    </>
  );
}

export default Page;
