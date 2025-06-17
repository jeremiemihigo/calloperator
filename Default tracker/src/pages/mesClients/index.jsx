import { Details, Search } from '@mui/icons-material';
import { Button, Fab, Grid, Paper, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Dot from 'components/@extended/Dot';
import AutoComplement from 'components/AutoComplete';
import ChangeByExcel from 'components/ChangeByExcel';
import DirectionSnackbar from 'components/Direction';
import NoCustomer from 'components/NoCustomer';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { config, lien_dt } from 'static/Lien';
import Popup from 'static/Popup';
import * as XLSX from 'xlsx';
import AddAction from './AddAction';
import ChangeStatus from './ChangeStatus';
import Chargement from './Chargement';
import './mesclient.style.css';

function Index() {
  const zone = useSelector((state) => state.zone.zone);
  const allfeedback = useSelector((state) => state.feedback.feedback);
  const [dateServer, setDateServer] = React.useState();
  const [texte, setTexte] = React.useState('');
  const [zoneSelect, setZoneSelect] = React.useState('');
  const [shop, setShop] = React.useState('');
  const role = useSelector((state) => state.role.role);
  const [roleselect, setRole] = React.useState('');
  const [client, setClient] = React.useState();
  const [data, setData] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [changestatus, setDatachange] = React.useState();

  const navigation = useNavigate();
  const logout = () => {
    localStorage.removeItem('auth');
    navigation('/login');
  };
  const fetchData = async (defaultv) => {
    try {
      setMessage('');
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
      if (response.status === 200) {
        setClient(response.data.client);
        setDateServer(response.data.dateServer);
      }
      if (response.status === 201) {
        setMessage(response.data);
        setClient([]);
      }
      if (response.data === 'token expired') {
        logout();
      }
    } catch (error) {}
  };
  const [open, setOpen] = React.useState(false);
  const handlechange = (donner) => {
    setDatachange(donner);
    setOpen(true);
  };

  React.useEffect(() => {
    if (role === 'token expired') {
      logout();
    }
  }, [role]);

  const information = (row) => {
    navigation('/customer_information', { state: row.codeclient });
  };

  const returnFeedback = (id, sinon) => {
    if (allfeedback && allfeedback.length > 0) {
      if (allfeedback.filter((x) => x.idFeedback === id).length > 0) {
        return allfeedback.filter((x) => x.idFeedback === id)[0]?.title;
      } else {
        return sinon;
      }
    }
    // return 'No_visits';
  };
  const returnvisite = (visites, type) => {
    //console.log(visites, type);
    if (visites.filter((x) => type.includes(x.demandeur.fonction)).length > 0) {
      let v = visites.filter((x) => type.includes(x.demandeur.fonction));
      const { demande } = v[v.length - 1];
      return returnFeedback(demande.raison, 'No_visits');
    } else {
      return 'No_visits';
    }
  };
  React.useEffect(() => {
    if (client && client.length > 0 && allfeedback && allfeedback.length > 0) {
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
          submitedBy: x.submitedBy,
          currentFeedback: x.tfeedback?.title,
          feedback_call: returnFeedback(x?.derniereappel?.sioui_texte, 'No_calls') || 'No_calls',
          last_vm_agent: x?.visites.length > 0 ? returnvisite(x.visites, ['agent', 'tech']) : 'No_visits',
          last_vm_rs: x?.visites.length > 0 ? returnvisite(x.visites, ['RS', 'TL']) : 'No_visits',
          last_vm_po: x?.visites.length > 0 ? returnvisite(x.visites, ['PO']) : 'No_visits',
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
  }, [client, allfeedback]);
  const [openAction, setOpenAction] = React.useState(false);
  const [types, setType] = React.useState('');
  const [dataedit, setDataEdit] = React.useState();
  const editOne = (type, data) => {
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
      field: 'last_vm_agent',
      headerName: 'Last VM Agent or Tech',
      width: 280,
      editable: false,
      renderCell: (p) => {
        return <Dot texte={p.row.last_vm_agent} />;
      }
    },
    {
      field: 'last_vm_po',
      headerName: 'VM_PO',
      width: 280,
      editable: false,
      renderCell: (p) => {
        return <Dot texte={p.row.last_vm_po} />;
      }
    },
    {
      field: 'last_vm_rs',
      headerName: 'VM_RS or TL',
      width: 280,
      editable: false,
      renderCell: (p) => {
        return <Dot texte={p.row.last_vm_rs} />;
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
        return <Dot onClick={() => handlechange(p.row)} texte={p.row.currentFeedback} />;
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
      field: 'submitedBy',
      headerName: 'submited By',
      width: 100,
      editable: false
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
      {message && <DirectionSnackbar message={message} />}
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
              <AutoComplement value={roleselect} setValue={setRole} options={role} title="Department" propr="title" />
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

        {!loading && allfeedback && allfeedback.length > 0 && data && data.length > 0 && (
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

      {dataedit && openAction && (
        <Popup open={openAction} setOpen={setOpenAction} title={`${types} ${dataedit?.codeclient}`}>
          <AddAction data={dataedit} fetchData={fetchData} type={types} />
        </Popup>
      )}
      {changestatus && (
        <Popup open={open} setOpen={setOpen} title="Change status">
          <ChangeStatus client={changestatus} setOpen={setOpen} allclient={data} setClient={setData} />
        </Popup>
      )}
    </div>
  );
}

export default Index;
