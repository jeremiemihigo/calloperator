import { Message } from '@mui/icons-material';
import { Fab, Grid, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import LoaderGif from 'components/LoaderGif';
import moment from 'moment';
import Chat from 'pages/Issue/Appel/Chat';
import React from 'react';
import { config, lien_issue } from 'static/Lien';
import { CreateContexteTable } from '../Contexte';
import Couleur from './Color';

function MyBackOffice() {
  const [data, setData] = React.useState();

  const { setPlainteSelect, setSelect } = React.useContext(CreateContexteTable);

  const loading = async () => {
    try {
      const response = await axios.get(lien_issue + '/mybackoffice', config);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loading();
  }, []);

  const openChat = (plainte) => {
    setPlainteSelect(plainte);
    setSelect(3);
  };

  const columns = [
    {
      field: 'codeclient',
      headerName: 'Code client',
      width: 120,
      editable: false
    },
    {
      field: 'statut',
      headerName: 'Statut',
      width: 100,
      editable: false,
      renderCell: (params) => {
        return <Couleur text={params.row.statut} />;
      }
    },
    {
      field: 'typePlainte',
      headerName: 'Type Plainte',
      width: 100,
      editable: false
    },
    {
      field: 'plainteSelect',
      headerName: 'Plainte',
      width: 150,
      editable: false
    },
    {
      field: 'dateSave',
      headerName: 'Date open',
      width: 75,
      editable: false,
      renderCell: (p) => {
        return moment(p.row.dateSave).format('DD/MM');
      }
    },

    {
      field: 'sla',
      headerName: 'Type',
      width: 75,
      editable: false,
      renderCell: (params) => {
        return <Couleur text={params.row.open ? 'Ouvert' : 'Fermer'} />;
      }
    },
    {
      field: 'Action',
      headerName: 'Action',
      width: 70,
      editable: false,
      renderCell: (params) => {
        return (
          <Fab size="small" color="primary" onClick={() => openChat(params.row)}>
            {params.row.message ? params.row.message.length : <Message fontSize="small" />}
          </Fab>
        );
      }
    }
  ];
  const getId = (p) => {
    return p._id;
  };

  return (
    <>
      {!data && <LoaderGif width={400} height={400} />}
      {data && data.length === 0 && <p style={{ textAlign: 'center', color: 'blue', fontWeight: 'bolder' }}>No request</p>}
      <Grid container>
        <Grid item lg={8}>
          {data && data.length > 0 && (
            <Paper sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} elevation={4}>
              <div>
                {' '}
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
                  disableRowSelectionOnClick
                  getRowId={getId}
                />
              </div>
            </Paper>
          )}
        </Grid>
        <Grid item lg={4} sx={{ paddingLeft: '10px' }}>
          <Paper elevation={4} sx={{ padding: '10px' }}>
            <Chat />
          </Paper>
        </Grid>
      </Grid>

      {/* <Rebour /> */}
    </>
  );
}

export default React.memo(MyBackOffice);
