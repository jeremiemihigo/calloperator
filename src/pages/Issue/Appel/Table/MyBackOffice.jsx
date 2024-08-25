import { Message } from '@mui/icons-material';
import { Fab, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import LoaderGif from 'components/LoaderGif';
import { CreateContexteGlobal } from 'GlobalContext';
import moment from 'moment';
import React from 'react';
import { config, lien_issue, TimeCounter } from 'static/Lien';
import axios from '../../../../../node_modules/axios/index';
import { CreateContexteTable } from '../Contexte';
import Couleur from './Color';

function MyBackOffice() {
  const [data, setData] = React.useState();

  const { setPlainteSelect, setSelect } = React.useContext(CreateContexteTable);
  const { client } = React.useContext(CreateContexteGlobal);
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
  }, [client]);

  const openChat = (plainte) => {
    setPlainteSelect(plainte);
    setSelect(3);
  };

  const returnTime = (date1, date2) => {
    let resultat = (new Date(date2).getTime() - new Date(date1).getTime()) / 60000;
    if (resultat < 1) {
      return 1;
    } else {
      return resultat;
    }
  };

  const columns = [
    {
      field: 'codeclient',
      headerName: 'Code client',
      width: 120,
      editable: false
    },
    {
      field: 'contact',
      headerName: 'Contact',
      width: 80,
      editable: false
    },
    {
      field: 'statut',
      headerName: 'Statut',
      width: 160,
      editable: false,
      renderCell: (params) => {
        return <Couleur text={params.row.statut} />;
      }
    },
    {
      field: 'typePlainte',
      headerName: 'Type Plainte',
      width: 150,
      editable: false
    },
    {
      field: 'plainteSelect',
      headerName: 'Plainte',
      width: 150,
      editable: false
    },
    {
      field: 'submitedBy',
      headerName: 'Saved By',
      width: 100,
      editable: false
    },
    {
      field: 'dateSave',
      headerName: 'Date open',
      width: 75,
      editable: false,
      renderCell: (p) => {
        return moment(p.row.dateSave).format('DD/MM hh:mm');
      }
    },
    {
      field: 'dateClose',
      headerName: 'SLA',
      width: 75,
      editable: false,
      renderCell: (p) => {
        return p.row.open ? (
          TimeCounter((p.row.time_delai - returnTime(p.row.fullDateSave, new Date())).toFixed(0))
        ) : (
          <Couleur text={p.row.delai} />
        );
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
            <Message fontSize="small" />
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
      {data && data.length > 0 && (
        <Paper elevation={4}>
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
        </Paper>
      )}
      {/* <Rebour /> */}
    </>
  );
}

export default MyBackOffice;
