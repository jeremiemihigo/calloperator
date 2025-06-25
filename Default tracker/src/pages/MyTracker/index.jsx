import { Grid, Paper, TextField, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Dot from 'components/@extended/Dot';
import AutoComplement from 'components/AutoComplete';
import SimpleBackdrop from 'components/Backdrop';
import ChangeByExcel from 'components/ChangeByExcel';
import DirectionSnackbar from 'components/Direction';
import NoCustomer from 'components/NoCustomer';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { config, lien_dt } from 'static/Lien';
import * as XLSX from 'xlsx';
import Chargement from './Chargement';
import './mesclient.style.css';

function Index() {
  const zone = useSelector((state) => state.zone.zone);
  const allfeedback = useSelector((state) => state.feedback.feedback);
  const [zoneSelect, setZoneSelect] = React.useState('');
  const [shop, setShop] = React.useState('');
  const role = useSelector((state) => state.role.role);
  const [client, setClient] = React.useState();
  const [data, setData] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const navigation = useNavigate();
  const logout = () => {
    localStorage.removeItem('auth');
    navigation('/login');
  };
  const fetchData = async () => {
    try {
      setMessage('');
      setLoading(true);
      setData();
      const response = await axios.get(lien_dt + '/allclient', config);
      if (response.status === 200) {
        setClient(response.data.client);
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

  React.useEffect(() => {
    if (role === 'token expired') {
      logout();
    }
  }, [role]);

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
          actif: x.actif,
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
      field: 'region',
      headerName: 'Region',
      width: 100,
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
      field: 'actif',
      headerName: 'In process',
      width: 100,
      editable: false,
      renderCell: (p) => {
        return <Dot texte={p.row.actif ? 'En cours' : 'Achevé'} />;
      }
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
        return <Dot texte={p.row.currentFeedback} />;
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      editable: false,
      renderCell: (p) => {
        return <Dot texte={p.row.action} />;
      }
    },
    {
      field: 'statut_decision',
      headerName: 'Decision',
      width: 150,
      editable: false,
      renderCell: (p) => {
        return <Dot texte={p.row.statut_decision} />;
      }
    },
    {
      field: 'incharge',
      headerName: 'In charge',
      width: 100,
      editable: false,
      renderCell: (p) => {
        return <Tooltip title={p.row.incharge.join('; ')}>{p.row.incharge.join('; ')}</Tooltip>;
      }
    },
    {
      field: 'submitedBy',
      headerName: 'submited By',
      width: 100,
      editable: false
    }
  ];

  const StructureDataExcel = (e) => {
    e.preventDefault();
    const fileName = 'All customer to track in default tracker';
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DT');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };
  React.useEffect(() => {
    fetchData();
  }, []);

  const [filterFn, setFilterFn] = React.useState({
    fn: (items) => {
      return items;
    }
  });
  const handleChanges = (e) => {
    let target = e.target.value;
    setFilterFn({
      fn: (items) => {
        if (target === '') {
          return items;
        } else {
          return items.filter(
            (x) => x.codeclient.toUpperCase().includes(target.toUpperCase()) || x.nomclient.toUpperCase().includes(target.toUpperCase())
          );
        }
      }
    });
  };
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(true);
    setFilterFn({
      fn: (items) => {
        if (shop === '' && zoneSelect === '') {
          return items;
        }
        if (zoneSelect !== '' && shop === '') {
          return items.filter((x) => x.region === zoneSelect?.denomination);
        }
        if (zoneSelect !== '' && shop !== '') {
          return items.filter((x) => x.shop === shop?.shop);
        }
      }
    });
    setOpen(false);
  }, [zoneSelect, shop]);

  return (
    <div>
      <SimpleBackdrop open={open} />
      {message && <DirectionSnackbar message={message} />}
      <Paper elevation={2} sx={{ padding: '10px', marginBottom: '10px' }}>
        <Grid container>
          <Grid item lg={3} xs={6} sm={3} md={3} sx={{ padding: '2px' }}>
            <TextField onChange={(e) => handleChanges(e)} fullWidth label="customer code or customer name" id="customer" />
          </Grid>
          <Grid item lg={2} xs={6} sm={2} md={2} sx={{ padding: '2px' }}>
            <AutoComplement value={zoneSelect} setValue={setZoneSelect} options={zone} title="Region" propr="denomination" />
          </Grid>
          {zoneSelect && (
            <Grid item lg={2} xs={6} sm={2} md={2} sx={{ padding: '2px' }}>
              <AutoComplement value={shop} setValue={setShop} options={zoneSelect?.shop} title="Shop" propr="shop" />
            </Grid>
          )}
        </Grid>
      </Paper>
      <Paper elevation={2}>
        {data && !loading && data.length > 0 && (
          <div className="excelFile">
            <ChangeByExcel texte="Export in Excel" onClick={(e) => StructureDataExcel(e)} />
          </div>
        )}
        {data && !loading && data.length === 0 && <NoCustomer texte="No results found" />}

        {loading && <Chargement />}

        {!loading && allfeedback && allfeedback.length > 0 && data && data.length > 0 && (
          <div>
            <DataGrid
              rows={filterFn.fn(data)}
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
    </div>
  );
}

export default Index;
