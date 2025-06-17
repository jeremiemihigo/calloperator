import { Edit } from '@mui/icons-material';
import { Fab, Paper, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Dot from 'components/@extended/Dot';
import ChangeByExcel from 'components/ChangeByExcel';
import ExcelFile from 'components/ExcelFile';
import LoaderGif from 'components/LoaderGif';
import NoCustomer from 'components/NoCustomer';
import _ from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { config, lien_dt } from 'static/Lien';
import Popup from 'static/Popup';
import './arbitrage.style.css';
import ChangeCurrent from './ChangeCurrent';
import Formulaire from './Formulaire';

function Index() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [changestatus, setChangestatus] = React.useState();
  const [dataedit, setDataEdit] = React.useState();
  const allfeedback = useSelector((state) => state.feedback.feedback);

  const functionData = (donner) => {
    setDataEdit(donner);
    setChangestatus();
    setOpen(true);
  };
  const changestat = (donner, property) => {
    setChangestatus({ donner, property });
    setOpen(true);
  };
  const logout = () => {
    localStorage.removeItem('auth');
    navigate('/login');
  };
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState();

  const returnvisite = (visites, type) => {
    //console.log(visites, type);
    if (visites.filter((x) => type.includes(x.demandeur.fonction)).length > 0) {
      let v = visites.filter((x) => type.includes(x.demandeur.fonction));
      const { demande } = v[v.length - 1];
      return returnFeedback(demande.raison, 'No_visits', allfeedback);
    } else {
      return 'No_visits';
    }
  };

  const loadingData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(lien_dt + '/arbitrage', config);
      if (response.data === 'token expired') {
        logout();
      }
      if (response.status === 200) {
        let table = response.data.map((x) => {
          return {
            ...x,
            incharge: x.incharge.map(function (x) {
              return x.title;
            }),
            last_vm_agent: x?.visites.length > 0 ? returnvisite(x.visites, ['agent', 'tech']) : 'No_visits',
            last_vm_rs: x?.visites.length > 0 ? returnvisite(x.visites, ['RS', 'TL']) : 'No_visits',
            last_vm_po: x?.visites.length > 0 ? returnvisite(x.visites, ['PO']) : 'No_visits'
          };
        });

        setData(table);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  // const information = (codeclient) => {
  //   navigate('/customer_information', { state: codeclient });
  // };

  React.useEffect(() => {
    loadingData();
  }, []);
  const feedporto = useSelector((state) => state.feedback.feedback);
  const returnFeedback = (id) => {
    if (_.filter(feedporto, { idFeedback: id }).length > 0) {
      return _.filter(feedporto, { idFeedback: id })[0].title;
    } else {
      return id;
    }
  };
  const returnDt = (row) => {
    if (row.appel && row.visite && row.appel === row.visite && _.filter(feedporto, { id: row.appel }).length > 0) {
      return _.filter(feedporto, { id: row.appel })[0].feeddt[0].title;
    } else {
      return row.changetotitle;
    }
  };
  const columns = [
    {
      field: 'codeclient',
      headerName: 'customer ID',
      width: 110,
      editable: false
    },
    {
      field: 'nomclient',
      headerName: 'customer_name',
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
      field: 'feedback',
      headerName: 'statut',
      width: 100,
      editable: false,
      renderCell: (p) => {
        return <Dot texte={p.row.feedback} />;
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
      field: 'appel',
      headerName: 'Appel',
      width: 150,
      editable: false,
      renderCell: (p) => {
        return <Dot texte={p.row.appel ? returnFeedback(p.row.appel) : 'No_calls'} />;
      }
    },

    {
      field: 'currentTitle',
      headerName: 'current_Feedback',
      width: 180,
      editable: false,
      renderCell: (p) => {
        return <Dot onClick={() => changestat(p.row, 'currentFeedback')} texte={p.row.currentTitle} />;
      }
    },
    {
      field: 'changetotitle',
      headerName: 'Next_feedback',
      width: 180,
      editable: false,
      renderCell: (p) => {
        return <Dot onClick={() => changestat(p.row, 'changeto')} texte={returnDt(p.row, 'dt')} />;
      }
    },
    {
      field: 'incharge',
      headerName: 'Next in charge',
      width: 200,
      editable: false,
      renderCell: (p) => {
        return <>{p.row.incharge.join('; ')}</>;
      }
    },
    {
      field: 'submitedBy',
      headerName: 'submited_by',
      width: 100,
      editable: false
    },

    {
      field: 'Action',
      headerName: 'Action',
      width: 70,
      editable: false,
      renderCell: (p) => {
        return (
          <>
            <Tooltip title="Take action">
              <Fab sx={{ marginRight: '5px' }} size="small" color="primary" onClick={() => functionData(p.row)}>
                <Edit fontSize="small" />
              </Fab>
            </Tooltip>

            {/* <Tooltip title="More information">
              <Fab onClick={() => information(p.row.codeclient)} color="primary" size="small">
                <Details fontSize="small" />
              </Fab>
            </Tooltip> */}
          </>
        );
      }
    }
  ];
  const changeDirection = () => {
    let code = data
      .filter((x) => ['Pending', 'Rejected'].includes(x.feedback))
      .map((x) => {
        return {
          current_status: x.currentfeedback,
          id: x.id,
          codeclient: x.codeclient,
          nomclient: x.nomclient,
          par: x.par,
          statut: x.feedback,
          changetotitle: x.changetotitle,
          changeto: x.changeto,
          submitedBy: x.submitedBy
        };
      });
    navigate('/arbitrage_excel', { state: code });
  };
  return (
    <>
      <Paper elevation={3}>
        <div className="arbitrage">
          {data && <ExcelFile fileName="Arbitrage" data={data} />}
          {!loading && data && data.length > 0 && <ChangeByExcel texte="Change by Excel" onClick={() => changeDirection()} />}
        </div>
        {loading && <LoaderGif width={400} height={400} />}
        {!loading && data && data.length > 0 && (
          <div>
            <DataGrid
              rows={data}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 30
                  }
                }
              }}
              pageSizeOptions={[30]}
              disableRowSelectionOnClick
            />
          </div>
        )}
        {!loading && data && data.length === 0 && <NoCustomer texte="No customers waiting" />}
      </Paper>
      {dataedit && (
        <Popup open={open} setOpen={setOpen} title="Form">
          <Formulaire client={dataedit} data={data} setData={setData} />
        </Popup>
      )}
      {changestatus?.donner && (
        <Popup open={open} setOpen={setOpen} title="Change current status">
          <ChangeCurrent setOpen={setOpen} client={changestatus?.donner} property={changestatus?.property} loadingData={loadingData} />
        </Popup>
      )}
    </>
  );
}

export default Index;
