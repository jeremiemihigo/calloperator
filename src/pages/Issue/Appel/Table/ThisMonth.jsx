import { EscalatorSharp } from '@mui/icons-material';
import { Fab, Paper, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { message } from 'antd';
import axios from 'axios';
import LoaderGif from 'components/LoaderGif';
import { CreateContexteGlobal } from 'GlobalContext';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, lien_issue, returnDelai } from 'static/Lien';
import { CreateContexteTable } from '../Contexte';
import Couleur from './Color';

function AllCall() {
  const [data, setData] = React.useState();
  const { client, setClient } = React.useContext(CreateContexteGlobal);
  const { setPlainteSelect, setSelect } = React.useContext(CreateContexteTable);
  const user = useSelector((state) => state.user?.user);
  const loading = async () => {
    if (client) {
      setData(client.filter((x) => x.type === 'appel'));
    }
  };
  React.useEffect(() => {
    loading();
  }, [client]);
  const [confirmDialog, setConfirmDialog] = React.useState({ isOpen: false, title: '', subTitle: '' });

  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    messageApi.open({
      type,
      content: '' + texte,
      duration: 5
    });
  };
  const deedline = useSelector((state) => state.delai.delai);
  const changeStatus = async (row, statut) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    });
    if (user.nom !== row.submitedBy) {
      success(`seulement ${row.submitedBy} peut effectuer cette operation`, 'error');
    } else {
      const d = 'escalade';
      const now = await axios.get('https://worldtimeapi.org/api/timezone/Africa/Lubumbashi');
      let today = now.data;
      const delai = await returnDelai(d, deedline, today);
      const { _id } = row;
      if (statut === 'escalade') {
        const response = await axios.put(
          lien_issue + '/updateappel',
          { id: _id, data: { operation: 'backoffice', time_delai: delai } },
          config
        );
        if (response.status === 200) {
          const d = data.map((x) => (x._id === response.data._id ? response.data : x));
          setClient(d);
        }
      }
      if (statut === 'closed') {
        const response = await axios.put(lien_issue + '/updateappel', { id: _id, data: { statut } }, config);
        if (response.status === 200) {
          const d = data.map((x) => (x._id === response.data._id ? response.data : x));
          setData(d);
        }
      }
    }
  };

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
      field: 'contact',
      headerName: 'Contact',
      width: 80,
      editable: false
    },
    {
      field: 'statut',
      headerName: 'Statut',
      width: 120,
      editable: false,
      renderCell: (params) => {
        return (
          <Couleur
            onClick={() => params.row.statut === 'ongoing' && params.row.operation !== 'backoffice' && changeStatus(params.row, 'closed')}
            text={params.row.statut}
          />
        );
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
      field: 'submitedBy',
      headerName: 'Saved By',
      width: 100,
      editable: false
    },
    {
      field: 'recommandation',
      headerName: 'recommandation',
      width: 120,
      editable: false
    },
    {
      field: 'delai',
      headerName: 'Delai',
      width: 80,
      editable: false,
      renderCell: (params) => {
        return <Couleur text={params.row.delai} taille={10} />;
      }
    },

    {
      field: 'fullDateSave',
      headerName: 'Date open',
      width: 75,
      editable: false,
      renderCell: (p) => {
        return moment(p.row.fullDateSave).format('DD/MM hh:mm');
      }
    },
    {
      field: 'Action',
      headerName: 'Action',
      width: 130,
      editable: false,
      renderCell: (params) => {
        return (
          <>
            <Tooltip title="Suivi">
              <Fab sx={{ marginRight: '5px' }} size="small" color="primary" onClick={() => openChat(params.row)}>
                {params.row.message ? params.row.message.length : 0}
              </Fab>
            </Tooltip>
            {params.row.statut === 'ongoing' && (
              <Tooltip title="Escalader vers le Backoffice">
                <Fab onClick={() => changeStatus(params.row, 'escalade')} sx={{ marginRight: '5px' }} size="small" color="primary">
                  <EscalatorSharp fontSize="small" />
                </Fab>
              </Tooltip>
            )}
          </>
        );
      }
    }
  ];
  const getId = (p) => {
    return p._id;
  };
  return (
    <div>
      {contextHolder}
      {!data && <LoaderGif width={400} height={400} />}
      {data && (
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
    </div>
  );
}

export default AllCall;
