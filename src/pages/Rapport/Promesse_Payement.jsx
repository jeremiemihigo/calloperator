import { Grid, Paper, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import LoaderGif from 'components/LoaderGif';
import moment from 'moment';
import React from 'react';
import { config, lien } from 'static/Lien';
import * as XLSX from 'xlsx';
import JustPayed from './JustPayed';

const Promesse_Payement = () => {
  const [data, setData] = React.useState();
  const [load, setLoad] = React.useState(false);
  const loading = async () => {
    setLoad(true);
    try {
      const response = await axios.get(lien + '/call_today', config);
      if (response.status === 200) {
        let donner = response.data;
        let info = [];
        for (let i = 0; i < donner.length; i++) {
          info.push({
            id: donner[i].idDemande,
            customer_ID: donner[i].codeclient,
            customer_name: donner[i].nomClient,
            customer_status: donner[i].clientStatut,
            PayementStatut: donner[i].PayementStatut,
            Days: donner[i].demande.jours,
            adresschange: donner[i].adresschange,
            contact: donner[i].demande?.numero === 'undefined' ? '' : donner[i].demande?.numero,
            Date: donner[i].dateSave,
            commune: donner[i].demande?.commune,
            sector: donner[i].demande?.sector,
            cell: donner[i].demande?.cell,
            reference: donner[i].demande?.reference,
            sat: donner[i].demande?.sat
          });
        }
        setData(info);
        setLoad(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loading();
  }, []);
  const columns = [
    {
      field: 'customer_ID',
      headerName: 'Customer',
      width: 120,
      editable: false
    },

    {
      field: 'PayementStatut',
      headerName: 'PayementStatut',
      width: 100,
      editable: false
    },
    {
      field: 'Days',
      headerName: 'Days',
      width: 70,
      editable: false,
      renderCell: (p) => {
        return <>{p.row.Days > 1 ? p.row.Days + ' jours' : p.row.Days + 'jour'}</>;
      }
    },
    {
      field: 'adresschange',
      headerName: 'Adresschange',
      width: 100,
      editable: false
    },
    {
      field: 'contact',
      headerName: 'contact',
      width: 100,
      editable: false
    },
    {
      field: 'Date',
      headerName: 'Date',
      width: 100,
      editable: false,
      renderCell: (params) => {
        return <>{moment(params.row.Date).format('DD-MM-YYYY')}</>;
      }
    },
    {
      field: 'Adresse',
      headerName: 'Adresse',
      width: 430,
      editable: false,
      renderCell: (p) => {
        return <>{p.row.commune + '/' + p.row.sector + '/' + p.row.cell + '/' + p.row.sat + '/' + p.row.reference}</>;
      }
    }
  ];
  const [value, setValue] = React.useState(true);

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customer_to_call_back');
    XLSX.writeFile(workbook, 'Customer_to_call_back.xlsx');
  };

  return (
    <>
      <Paper elevation={4} sx={{ padding: '10px' }}>
        <Grid sx={{ display: 'flex' }}>
          <Typography
            component="p"
            onClick={() => setValue(!value)}
            style={{ color: 'blue', padding: '0px', margin: '0px', cursor: 'pointer', fontWeight: 'bolder', fontSize: '12px' }}
          >
            {value ? 'Import payment' : 'Go back'}
          </Typography>
          {data && (
            <Typography
              component="p"
              onClick={() => downloadExcel()}
              style={{ color: 'green', padding: '0px', margin: '0px 15px', cursor: 'pointer', fontWeight: 'bolder', fontSize: '12px' }}
            >
              Export to excel
            </Typography>
          )}
        </Grid>
        {load && <LoaderGif width={400} height={400} />}
        {value && !load && (
          <Grid>
            {data && (
              <DataGrid
                rows={data}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 15
                    }
                  }
                }}
                pageSizeOptions={[15]}
                checkboxSelection
                disableRowSelectionOnClick
              />
            )}
          </Grid>
        )}
        {!value && <JustPayed />}
      </Paper>
    </>
  );
};

export default Promesse_Payement;
