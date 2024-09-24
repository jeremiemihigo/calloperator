import { Message } from '@mui/icons-material';
import { Fab, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import NoCustomer from 'components/Attente';
import LoaderGif from 'components/LoaderGif';
import { CreateContexteGlobal } from 'GlobalContext';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { TimeCounter } from 'static/Lien';
import { CreateContexteTable } from '../Contexte';
import Couleur from './Color';

function AllCall() {
  const [data, setData] = React.useState();

  const { client } = React.useContext(CreateContexteGlobal);
  const { setPlainteSelect, setSelect } = React.useContext(CreateContexteTable);
  const loading = () => {
    if (client) {
      setData(_.filter(client, { operation: 'backoffice' }));
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
      field: 'property',
      headerName: 'Provenance',
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
        return moment(p.row.dateSave).format('DD/MM/YYYY');
      }
    },
    {
      field: 'dateClose',
      headerName: 'SLA',
      width: 100,
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
      field: 'open',
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
      {data && data.length > 0 && (
        <Paper sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} elevation={4}>
          <div>
            <DataGrid
              rows={data}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 100
                  }
                }
              }}
              pageSizeOptions={[100]}
              disableRowSelectionOnClick
              getRowId={getId}
            />
          </div>
        </Paper>
      )}
      {data && data.length === 0 && <NoCustomer texte="No backoffice complaints" />}
      {/* <Rebour /> */}
    </>
  );
}

export default React.memo(AllCall);
