import { Details, Search } from '@mui/icons-material';
import { Button, Fab, Grid, Paper, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Dot from 'components/@extended/Dot';
import AutoComplement from 'components/AutoComplete';
import ChangeByExcel from 'components/ChangeByExcel';
import NoCustomer from 'components/NoCustomer';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { config, lien_dt } from 'static/Lien';
import Popup from 'static/Popup';
import * as XLSX from 'xlsx';
import AddAction from './AddAction';
import Options from './ChangeStatus';
import Chargement from './Chargement';
import Agent from './Modification/Agent';
import VisiteMenage from './Modification/VisiteMenage';
import './mesclient.style.css';

function Index() {
  const zone = useSelector((state) => state.zone.zone);
  const [dateServer, setDateServer] = React.useState();
  const [texte, setTexte] = React.useState('');
  const [zoneSelect, setZoneSelect] = React.useState('');
  const [shop, setShop] = React.useState('');
  const role = useSelector((state) => state.role.role);
  const [roleselect, setRole] = React.useState('');
  const [client, setClient] = React.useState();
  const [data, setData] = React.useState();
  const [loading, setLoading] = React.useState(false);

  const navigation = useNavigate();
  const logout = () => {
    localStorage.removeItem('auth');
    navigation('/login');
  };
  const fetchData = async (defaultv) => {
    try {
      setLoading(true);
      setData();
      const name_ = texte;
      const shops = shop?.shop;
      const region = zoneSelect?.denomination;
      const departement = roleselect?.idRole;
      let data = {};
      if (texte) {
        data.codeclient = name_;
      }
      if (shops) {
        data.shop = shops;
      }
      if (region) {
        data.region = region;
      }
      if (departement) {
        data['tfeedback.idRole'] = departement;
      }
      const response = await axios.post(lien_dt + '/lienclient', { data, defaultv, taille: { $lte: 0 } }, config);
      console.log(response);
      if (response.status === 200) {
        setClient(response.data.client);
        setDateServer(response.data.dateServer);
      }
      if (response.data === 'token expired') {
        logout();
      }
    } catch (error) {}
  };

  React.useEffect(() => {
    if (role === 'token expired') {
      logout();
    }
  }, [role]);

  const information = (row) => {
    navigation('/customer_information', { state: row.codeclient });
  };

  const willBeVisitedBy = (objectif) => {
    if (objectif.length > 0) {
      return objectif[0].codeAgent;
    } else {
      return 'No_people';
    }
  };
  React.useEffect(() => {
    if (client && client.length > 0) {
      const datae = client?.map(function (x, id) {
        return {
          id,
          _id: x._id,
          idFeedback: x.currentFeedback,
          codeclient: x.codeclient,
          nomclient: x.nomclient,
          nom: x.nomclient,
          par: x.par,
          region: x.region,
          shop: x.shop,
          action: x.action,
          currentFeedback: x.tfeedback?.title,
          feedback_call: x?.derniereappel?.sioui_texte || 'no_calls',
          last_vm: x?.derniereVisite ? x.derniereVisite.demande.raison : 'no_visits',
          visited_by: willBeVisitedBy(x.objectif),
          sla: x.tfeedback.delai * 1440,
          fullDate: x.fullDate,
          statut_decision: x.statut_decision,
          incharge: x.incharge.map(function (x) {
            return x.title;
          })
        };
      });

      setData(datae);
      setLoading(false);
    } else {
      setData([]);
      setLoading(false);
    }
  }, [client]);

  const [openAgent, setOpenAgent] = React.useState(false);
  const [openvisite, setOpenVisite] = React.useState(false);
  const [openAction, setOpenAction] = React.useState(false);
  const [types, setType] = React.useState('');
  const [dataedit, setDataEdit] = React.useState();
  const editOne = (type, data) => {
    if (type === 'agent') {
      setOpenAgent(true);
    }
    if (type === 'visite') {
      setOpenVisite(true);
    }
    if (type === 'action') {
      setOpenAction(true);
      setType(type);
    }
    if (type === 'decision') {
      setOpenAction(true);
      setType(type);
    }
    setDataEdit(data);
  };
  const returnTime = (date1, date2) => {
    let resultat = (new Date(date2).getTime() - new Date(date1).getTime()) / 60000;
    if (resultat < 1) {
      return 1;
    } else {
      return resultat;
    }
  };
  function TimeCounter(durationInMinutes) {
    const [remainingTimeInSeconds, setRemainingTimeInSeconds] = React.useState(durationInMinutes * 60);

    React.useEffect(() => {
      const interval = setInterval(() => {
        setRemainingTimeInSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      // Nettoyage du timer à la fin
      return () => clearInterval(interval);
    }, []);

    if (remainingTimeInSeconds <= 0) {
      return (
        <p
          style={{
            background: 'red',
            padding: '0px',
            margin: '0px',
            height: '50%',
            fontSize: '12px',
            color: 'white',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '5px',
            justifyContent: 'center'
          }}
        >
          OUT SLA
        </p>
      );
    } else {
      const days = Math.floor(remainingTimeInSeconds / (24 * 3600));
      const hours = Math.floor((remainingTimeInSeconds % (24 * 3600)) / 3600);
      const minutes = Math.floor((remainingTimeInSeconds % 3600) / 60);
      const seconds = remainingTimeInSeconds % 60;
      return (
        <p
          style={{
            background: 'green',
            padding: '0px',
            borderRadius: '10px',
            margin: '0px',
            height: '50%',
            fontSize: '12px',
            color: 'white',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {`
      ${days + 'jr'} ${hours + 'h'} ${minutes + 'm'} ${seconds + 's'}
      `}
        </p>
      );
    }
  }

  const columns = [
    {
      field: 'codeclient',
      headerName: 'Code client',
      width: 120,
      pinned: 'left'
    },
    {
      field: 'nomclient',
      headerName: 'customer name',
      width: 120,
      editable: false
    },
    {
      field: 'shop',
      headerName: 'Shop',
      width: 100,
      editable: false
    },

    {
      field: 'par',
      headerName: 'PAR',
      width: 80,
      editable: false
    },

    {
      field: 'visitedBy',
      headerName: 'Visited_by',
      width: 100,
      editable: false,
      renderCell: (p) => {
        return <Dot onClick={() => editOne('agent', p.row)} texte={p.row.visited_by} />;
      }
    },
    {
      field: 'last_vm',
      headerName: 'Last Feedback_VM',
      width: 280,
      editable: false,
      renderCell: (p) => {
        return <Dot onClick={() => editOne('visite', p.row)} texte={p.row.last_vm} />;
      }
    },
    {
      field: 'feedback_call',
      headerName: 'Feedback_appel',
      width: 250,
      editable: false,
      renderCell: (p) => {
        return <Dot texte={p.row.feedback_call} />;
      }
    },

    {
      field: 'currentFeedback',
      headerName: 'Current status',
      width: 200,
      editable: false,
      renderCell: (p) => {
        return <Options client={p.row} allclient={client} setClient={setClient} />;
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      editable: false,
      renderCell: (p) => {
        return <Dot onClick={() => editOne('action', p.row)} texte={p.row.action} />;
      }
    },
    {
      field: 'statut_decision',
      headerName: 'Decision',
      width: 150,
      editable: false,
      renderCell: (p) => {
        return <Dot onClick={() => editOne('decision', p.row)} texte={p.row.statut_decision} />;
      }
    },
    {
      field: 'incharge',
      headerName: 'In charge',
      width: 100,
      editable: false,
      renderCell: (p) => {
        return <>{p.row.incharge.join(';')}</>;
      }
    },
    {
      field: 'dateClose',
      headerName: 'SLA',
      width: 130,
      editable: false,
      renderCell: (p) => {
        return TimeCounter((p.row.sla - returnTime(p.row.fullDate, new Date(dateServer))).toFixed(0));
      }
    },
    {
      field: 'change',
      headerName: 'Change',
      width: 70,
      editable: false,
      renderCell: (p) => {
        return (
          <>
            <Fab color="primary" size="small" onClick={() => information(p.row)}>
              <Details fontSize="small" />
            </Fab>
          </>
        );
      }
    }
  ];

  const StructureDataExcel = (e) => {
    e.preventDefault();
    const fileName = 'customer_to_track';
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DT');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };
  React.useEffect(() => {
    fetchData(true);
  }, []);

  const changeDirection = (link) => {
    navigation(link);
  };

  return (
    <div>
      <Paper elevation={2} sx={{ padding: '10px', marginBottom: '10px' }}>
        <Grid container>
          <Grid item lg={3} xs={6} sm={3} md={3} sx={{ padding: '2px' }}>
            <TextField onChange={(e) => setTexte(e.target.value)} fullWidth label="customer code " id="customer code" />
          </Grid>
          <Grid item lg={2} xs={6} sm={2} md={2} sx={{ padding: '2px' }}>
            <AutoComplement value={zoneSelect} setValue={setZoneSelect} options={zone} title="Region" propr="denomination" />
          </Grid>
          {zoneSelect && (
            <Grid item lg={2} xs={6} sm={2} md={2} sx={{ padding: '2px' }}>
              <AutoComplement value={shop} setValue={setShop} options={zoneSelect?.shop} title="Shop" propr="shop" />
            </Grid>
          )}
          {role && role !== 'token expired' && (
            <Grid item lg={2} xs={6} sm={2} md={2} sx={{ padding: '2px' }}>
              <AutoComplement
                value={roleselect}
                setValue={setRole}
                options={role?.filter((x) => x.type === 'operation')}
                title="Department"
                propr="title"
              />
            </Grid>
          )}

          <Grid item lg={1} xs={6} sm={1} md={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button fullWidth disabled={loading} onClick={() => fetchData(false)} color="primary" variant="contained">
              <Search fontSize="small" />
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Paper elevation={2}>
        {data && !loading && data.length > 0 && (
          <div className="excelFile">
            <ChangeByExcel texte="Export in Excel" onClick={(e) => StructureDataExcel(e)} />
            <ChangeByExcel texte="Import actions" onClick={() => changeDirection('/change_action_excel')} />
            <ChangeByExcel texte="Change status" onClick={() => changeDirection('/change_status_excel')} />
            <ChangeByExcel texte="Import decisions" onClick={() => changeDirection('/change_decision_excel')} />
          </div>
        )}
        {data && !loading && data.length === 0 && <NoCustomer texte="No results found" />}

        {loading && <Chargement />}

        {!loading && data && data.length > 0 && (
          <div>
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
              pageSizeOptions={[50]}
              disableRowSelectionOnClick
            />
          </div>
        )}
      </Paper>
      {dataedit && openAgent && (
        <Popup open={openAgent} setOpen={setOpenAgent} title={`Edit agent for customer ${dataedit?.codeclient}`}>
          <Agent data={dataedit} fetchData={fetchData} />
        </Popup>
      )}

      {dataedit && openvisite && (
        <Popup open={openvisite} setOpen={setOpenVisite} title={`Modification du feedback VM du client ${dataedit?.codeclient}`}>
          <VisiteMenage data={dataedit} fetchData={fetchData} />
        </Popup>
      )}
      {dataedit && openAction && (
        <Popup open={openAction} setOpen={setOpenAction} title={`${types} ${dataedit?.codeclient}`}>
          <AddAction data={dataedit} fetchData={fetchData} type={types} />
        </Popup>
      )}
    </div>
  );
}

export default Index;
