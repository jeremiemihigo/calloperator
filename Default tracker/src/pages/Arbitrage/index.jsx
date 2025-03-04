import { Details, Edit } from '@mui/icons-material';
import { Fab, Paper, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Dot from 'components/@extended/Dot';
import ChangeByExcel from 'components/ChangeByExcel';
import ExcelFile from 'components/ExcelFile';
import LoaderGif from 'components/LoaderGif';
import NoCustomer from 'components/NoCustomer';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { config, lien_dt } from 'static/Lien';
import Popup from 'static/Popup';
import Formulaire from './Formulaire';
import './arbitrage.style.css';

function Index() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [dataedit, setDataEdit] = React.useState();

  const functionData = (donner) => {
    setDataEdit(donner);
    setOpen(true);
  };
  const logout = () => {
    localStorage.removeItem('auth');
    navigate('/login');
  };
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState();
  const loadingData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(lien_dt + '/arbitrage', config);
      if (response.data === 'token expired') {
        logout();
      }
      if (response.status === 200) {
        setData(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const information = (codeclient) => {
    navigate('/customer_information', { state: codeclient });
  };

  React.useEffect(() => {
    loadingData();
  }, []);
  const columns = [
    {
      field: 'codeclient',
      headerName: 'customer ID',
      width: 120,
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
      field: 'currentTitle',
      headerName: 'current_Feedback',
      width: 180,
      editable: false
    },
    {
      field: 'changetotitle',
      headerName: 'Next_feedback',
      width: 180,
      editable: false
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
      width: 100,
      editable: false,
      renderCell: (p) => {
        return (
          <>
            <Tooltip title="Take action">
              <Fab sx={{ marginRight: '5px' }} size="small" color="primary" onClick={() => functionData(p.row)}>
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

      <Popup open={open} setOpen={setOpen} title="Form">
        <Formulaire client={dataedit} />
      </Popup>
    </>
  );
}

export default Index;
