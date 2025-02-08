import { Add, Details } from '@mui/icons-material';
import { Fab, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import moment from 'moment';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { config, lien_terrain } from 'static/Lien';
import Popup from 'static/Popup';
import AddServer from './AddServer';
import './servey.style.css';

function Index() {
  const [open, setOpen] = React.useState(false);
  const [data, setInfo] = React.useState();
  const readServey = async () => {
    try {
      const response = await axios.get(`${lien_terrain}/allservey`, config);
      if (response.status === 200) {
        setInfo(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    readServey();
  }, []);

  const navigate = useNavigate();
  const details = (idServey) => {
    navigate(`/servey/${idServey}`);
  };

  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      width: 280,
      editable: false
    },
    {
      field: 'subtitle',
      headerName: 'Subtitle',
      width: 250,
      editable: false
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 100,
      editable: false,
      renderCell: (params) => {
        return moment(params.row.createdAt).format('DD-MM-YYYY');
      }
    },
    {
      field: 'dateFin',
      headerName: 'Expired at',
      width: 130,
      editable: false,
      renderCell: (params) => {
        return moment(params.row.dateFin).format('dddd, DD-MM-YYYY');
      }
    },

    {
      field: 'concerne',
      headerName: 'Concerne',
      width: 200,
      editable: false,
      renderCell: (p) => {
        return (
          <>
            {p.row.concerne.map((index) => {
              return <span key={index}>{index}</span>;
            })}
          </>
        );
      }
    },
    {
      field: 'option',
      headerName: 'Option',
      width: 70,
      editable: false,
      renderCell: (p) => {
        return (
          <Fab onClick={() => details(p.row.idServey)} size="small" color="primary">
            <Details fontSize="small" />
          </Fab>
        );
      }
    }
  ];

  function getRowId(row) {
    return row._id;
  }
  return (
    <>
      <Paper
        onClick={() => setOpen(true)}
        elevation={1}
        sx={{ width: '100%', marginBottom: '10px', padding: '15px', cursor: 'pointer', marginTop: '10px' }}
      >
        <Add size="small" />
      </Paper>
      <Paper>
        {data && data.length > 0 && (
          <DataGrid
            rows={data}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 50
                }
              }
            }}
            getRowId={getRowId}
            pageSizeOptions={[50]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        )}
      </Paper>
      <Popup open={open} setOpen={setOpen} title="Ajoutez un servey">
        <AddServer />
      </Popup>
    </>
  );
}

export default Index;
