import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { message } from 'antd';
import axios from 'axios';
import LoaderGif from 'components/LoaderGif';
import SimpleBackdrop from 'Control/Backdrop';
import { CreateContexteGlobal } from 'GlobalContext';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, lien_issue, returnDelai, returnTime, TimeCounter } from 'static/Lien';
import Popup from 'static/Popup';
import AffectTech from '../AffectTech';
import { CreateContexteTable } from '../Contexte';
import RaisonFermeture from '../Formulaire/RaisonFermeture';
import ValiderAction from '../ValiderAction';
import Couleur from './Color';
import Options from './Options';

function ThisMonth_Tech() {
  const [data, setData] = React.useState();
  const { client, setClient, loadingClient } = React.useContext(CreateContexteGlobal);
  const { setPlainteSelect, setSelect } = React.useContext(CreateContexteTable);
  const [today, setToday] = React.useState({
    datetime: new Date(),
    day_of_week: new Date().getDay()
  });

  const [openFermeture, setOpenFermeture] = React.useState(false);
  const [idPlainte, setIdPlainte] = React.useState();
  const fermeture = (plainte) => {
    setIdPlainte(plainte);
    setOpenFermeture(true);
  };
  const loading = async () => {
    if (client) {
      setData(client.filter((x) => x.type === 'ticket'));
    }
  };
  React.useEffect(() => {
    loading();
  }, [client]);

  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    messageApi.open({
      type,
      content: '' + texte,
      duration: 5
    });
  };

  const settingDate = async () => {
    try {
      const now = await axios.get('https://worldtimeapi.org/api/timezone/Africa/Lubumbashi');
      setToday(now.data);
    } catch (error) {
      console.log(error);
    }
  };
  React.useLayoutEffect(() => {
    settingDate();
  }, []);

  const [open, setOpen] = React.useState(false);
  const [clientselect, setCustomer] = React.useState();
  const openForm = (e, row) => {
    e.preventDefault();
    setCustomer(row);
    setOpen(true);
  };
  const deedline = useSelector((state) => state.delai.delai);

  const [sending, setSending] = React.useState(false);
  const apresAssistance = async (row) => {
    try {
      if (!row.technicien) {
        success('The ticket is not assigned to a technician', 'error');
      } else {
        if (today) {
          setSending(true);
          const d = 'resolved_awaiting_confirmation';
          const delai = await returnDelai(d, deedline, today);
          const datas = {
            num_ticket: row.idPlainte,
            time_delai: delai,
            fullDate: today.datetime,
            delai: row.time_delai - returnTime(row.fullDateSave, today.datetime) > 0 ? 'IN SLA' : 'OUT SLA'
          };
          const response = await axios.post(lien_issue + '/assistance_ticket', datas, config);
          if (response.status === 200) {
            setClient(client.map((x) => (x._id === response.data._id ? response.data : x)));
            success('Done', 'success');
            setSending(false);
          } else {
            setSending(false);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [openV, setOpenV] = React.useState(false);
  const [clientV, setClientV] = React.useState();
  const Validation = (d) => {
    setClientV(d);
    setOpenV(true);
  };

  const openChat = (plainte, e) => {
    e.preventDefault();
    setPlainteSelect(plainte);
    setSelect(3);
  };
  const columns = [
    {
      field: 'codeclient',
      headerName: 'Code client',
      width: 110,
      editable: false
    },
    {
      field: 'idPlainte',
      headerName: 'Num_ticket',
      width: 90,
      editable: false
    },
    {
      field: 'actionSynchro',
      headerName: 'Synchro',
      width: 90,
      editable: false,
      renderCell: (p) => {
        return p.row?.technicien?.numSynchro;
      }
    },
    {
      field: 'statut',
      headerName: 'Statut',
      width: 200,
      editable: false,
      renderCell: (params) => {
        return <Couleur text={params.row.statut} />;
      }
    },

    {
      field: 'plainteSelect',
      headerName: 'Issue',
      width: 150,
      editable: false
    },
    {
      field: 'shop',
      headerName: 'Shop',
      width: 120,
      editable: false
    },
    {
      field: 'Tech',
      headerName: 'Tech',
      width: 80,
      editable: false,
      renderCell: (p) => {
        return p.row.technicien?.codeTech;
      }
    },

    {
      field: 'fullDateSave',
      headerName: 'Assign at',
      width: 75,
      editable: false,
      renderCell: (p) => {
        return moment(p.row.fullDateSave).format('DD/MM hh:mm');
      }
    },
    {
      field: 'submitedBy',
      headerName: 'Saved by',
      width: 90,
      editable: false,
      renderCell: (p) => {
        return p.row.submitedBy;
      }
    },
    {
      field: 'dateClose',
      headerName: 'SLA',
      width: 130,
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
      field: 'action',
      headerName: 'Action',
      width: 150,
      editable: false,
      renderCell: (p) => {
        return (
          <div>
            <Options
              client={p.row}
              openChat={openChat}
              validation={Validation}
              apresAssistance={apresAssistance}
              openForm={openForm}
              fermeture={fermeture}
            />
          </div>
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
      {sending && <SimpleBackdrop open={true} title="Please wait" taille="10rem" />}
      {loadingClient && <LoaderGif width={400} height={400} />}
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
      {clientselect && (
        <Popup open={open} setOpen={setOpen} title="Affectation tech">
          <AffectTech clients={clientselect} />
        </Popup>
      )}
      {clientV && (
        <Popup open={openV} setOpen={setOpenV} title="Check">
          <ValiderAction clients={clientV} />
        </Popup>
      )}
      <Popup open={openFermeture} setOpen={setOpenFermeture} title="Fermeture">
        <RaisonFermeture idPlainte={idPlainte} />
      </Popup>
    </div>
  );
}

export default React.memo(ThisMonth_Tech);
