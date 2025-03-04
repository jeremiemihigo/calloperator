import { Fab, Paper, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Dot from 'components/@extended/Dot';
import ChangeByExcel from 'components/ChangeByExcel';
import ExcelFile from 'components/ExcelFile';
import LoaderGif from 'components/LoaderGif';
import NoCustomer from 'components/NoCustomer';
import _ from 'lodash';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { config, lien_dt } from 'static/Lien';
import Popup from 'static/Popup';
import { Details, Edit } from '../../../node_modules/@mui/icons-material/index';
import { Tooltip } from '../../../node_modules/@mui/material/index';
import Form from './Form';
import './validation.style.css';

function Index() {
  const navigation = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState();
  const [statusListe, setStatusListe] = React.useState({
    statut: {},
    decision: {}
  });
  const [loading, setLoading] = React.useState(false);
  const logout = () => {
    localStorage.removeItem('auth');
    navigation('/login');
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(lien_dt + '/decision', config);
      if (response.status === 200) {
        setData(response.data);
        setStatusListe({
          statut: _.groupBy(response.data, 'statut'),
          decision: _.groupBy(response.data, 'decision')
        });
        setLoading(false);
      }
      if (response.data === 'token expired') {
        logout();
      }
    } catch (error) {}
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const [dataUpdate, setDataUpdate] = React.useState();
  const openFunction = (d) => {
    setOpen(true);
    setDataUpdate(d);
  };
  const information = (codeclient) => {
    navigation('/customer_information', { state: codeclient });
  };

  const columns = [
    {
      field: 'codeclient',
      headerName: 'customer_id',
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
      headerName: 'region',
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
      width: 100,
      editable: false
    },
    {
      field: 'statut',
      headerName: 'status',
      width: 90,
      editable: false,
      renderCell: (p) => {
        return <Dot texte={p.row.statut} />;
      }
    },

    {
      field: 'decision',
      headerName: 'Decision',
      width: 150,
      editable: false
    },
    {
      field: 'createdBy',
      headerName: 'Saved By',
      width: 150,
      editable: false
    },

    {
      field: 'Option',
      headerName: 'Option',
      width: 120,
      editable: false,
      renderCell: (p) => {
        return (
          <>
            <Tooltip title="Take action">
              <Fab sx={{ marginRight: '10px' }} onClick={() => openFunction(p.row)} color="primary" size="small">
                <Edit fontSize="small" />
              </Fab>
            </Tooltip>
            <Tooltip title="More information">
              <Fab onClick={() => information(p.row.codeclient)} color="primary" size="small">
                <Details fontSize="small" />
              </Fab>
            </Tooltip>
          </>
        );
      }
    }
  ];

  const [filterFn, setFilterFn] = React.useState({
    fn: (items) => {
      return items;
    }
  });
  const handleChanges = (event, type) => {
    setFilterFn({
      fn: (items) => {
        if (event === '') {
          return items;
        } else {
          return items.filter((x) => x['' + type] === event);
        }
      }
    });
  };

  const changeDirection = () => {
    let code = data
      .filter((x) => ['Pending', 'Rejected'].includes(x.statut))
      .map((x) => {
        return {
          id: x.id,
          codeclient: x.codeclient,
          nomclient: x.nomclient,
          last_statut: x.statut
        };
      });
    navigation('/excel_decision', { state: code });
  };
  return (
    <>
      {loading && <LoaderGif width={400} height={400} />}
      {!loading && data && data.length > 0 && (
        <Paper elevation={3} sx={{ padding: '10px' }}>
          <div className="titles">
            {Object.keys(statusListe.statut).map((x) => {
              return (
                <Typography onClick={() => handleChanges(x, 'statut')} component="p" className="statusTitle" key={x}>
                  <span>{x}</span> <span style={{ fontWeight: 'bolder' }}>{statusListe.statut[x].length}</span>
                </Typography>
              );
            })}
            {Object.keys(statusListe.decision).map((x) => {
              return (
                <Typography onClick={() => handleChanges(x, 'decision')} component="p" className="statusTitle" key={x}>
                  <span>{x}</span> <span style={{ fontWeight: 'bolder' }}>{statusListe.decision[x].length}</span>
                </Typography>
              );
            })}
            {data && <ExcelFile fileName="Decisions" data={data} />}
            <ChangeByExcel texte="Change by Excel" onClick={() => changeDirection()} />
          </div>
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
        </Paper>
      )}

      {!loading && data && data.length === 0 && <NoCustomer texte="No customers waiting" />}

      {dataUpdate && open && (
        <Popup open={open} setOpen={setOpen} title="Validation">
          <Form data={dataUpdate} fetchData={fetchData} />
        </Popup>
      )}
    </>
  );
}

export default Index;
