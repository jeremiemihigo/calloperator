import { Search } from '@mui/icons-material';
import { Button, CircularProgress, Grid, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Input } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React from 'react';
import ExcelButton from 'static/ExcelButton';
import { config, lien_issue } from 'static/Lien';
import Selected from 'static/Select';
import { generateNomFile } from './NameFile';

function Call() {
  const [dates, setDates] = React.useState({ debut: '', fin: '' });
  const [loading, setLoading] = React.useState(false);
  const [valueSelect, setValueSelect] = React.useState('');
  const { debut, fin } = dates;
  const [data, setData] = React.useState();
  const [nomFile, setNomFile] = React.useState('');

  const searchData = async () => {
    setLoading(true);
    const response = await axios.post(
      lien_issue + '/issuerapport',
      {
        debut,
        fin,
        valueSelect
      },
      config
    );
    setLoading(false);
    if (response.data === 'token expired') {
      localStorage.removeItem('auth');
      window.location.replace('/login');
    }
    if (response.status === 200 && response.data.length > 0) {
      let table = [];
      for (let i = 0; i < response.data.length; i++) {
        table.push({
          id: i,
          Date_call: moment(response.data[i]?.dateSave).format('DD/MM/YYYY'),
          Date_close: moment(response.data[i]?.dateClose).format('DD/MM/YYYY'),
          Time_call: moment(response.data[i]?.fullDateSave).format('hh:mm:ss'),
          Time_close: moment(response.data[i]?.dateClose).format('hh:mm:ss'),
          NOM: response.data[i]?.nomClient,
          Nature_Issue: response.data[i]?.typePlainte,
          Issue: response.data[i]?.plainteSelect,
          Recommandation: response.data[i]?.recommandation,
          statut: response.data[i]?.statut,
          'C.O': response.data[i]?.openBy,
          Delai: response.data[i]?.delai
        });
      }
      setData(table);
      setNomFile(generateNomFile(dates, 'No tech'));
    }
  };
  const select = [
    { id: 1, title: 'Resolved', value: 'resolved' },
    { id: 2, title: 'open', value: 'open' }
  ];

  const columns = [
    {
      field: 'Date_call',
      headerName: 'Date_call',
      width: 90,
      editable: false
    },
    {
      field: 'Date_close',
      headerName: 'Date_close',
      width: 90,
      editable: false
    },
    {
      field: 'Time_call',
      headerName: 'Time_call',
      width: 70,
      editable: false
    },
    {
      field: 'Time_close',
      headerName: 'Time_close',
      width: 70,
      editable: false
    },
    {
      field: 'NOM',
      headerName: 'Nombre',
      width: 150,
      editable: false
    },
    {
      field: 'Nature_Issue',
      headerName: 'Nature_Issue',
      width: 100,
      editable: false
    },
    {
      field: 'Issue',
      headerName: 'Issue',
      width: 150,
      editable: false
    },
    {
      field: 'Recommandation',
      headerName: 'Recommandation',
      width: 100,
      editable: false
    },
    {
      field: 'statut',
      headerName: 'statut',
      width: 70,
      editable: false
    },
    {
      field: 'C.O',
      headerName: 'C.O',
      width: 70,
      editable: false
    },
    {
      field: 'Delai',
      headerName: 'Delai',
      width: 70,
      editable: false
    }
  ];

  return (
    <Paper elevation={4} sx={{ padding: '10px' }}>
      <Grid container sx={{ marginTop: '10px' }}>
        <Grid item lg={2} sm={2} xs={12}>
          <Selected label="Filtrer par" data={select} value={valueSelect} setValue={setValueSelect} />
        </Grid>
        <Grid item lg={2} sm={3} xs={12} sx={{ display: 'flex', alignItems: 'center', marginTop: '5px', padding: '0px 5px' }}>
          <Input
            type="date"
            onChange={(e) =>
              setDates({
                ...dates,
                debut: e.target.value
              })
            }
            placeholder="Date"
          />
        </Grid>
        <Grid item lg={2} sm={3} xs={12} sx={{ marginTop: '5px', display: 'flex', alignItems: 'center', paddingRight: '5px' }}>
          <Input
            onChange={(e) =>
              setDates({
                ...dates,
                fin: e.target.value
              })
            }
            type="date"
            placeholder="Date"
          />
        </Grid>
        <Grid item lg={1} sm={1} xs={1} sx={{ marginTop: '5px', display: 'flex', alignItems: 'center', paddingRight: '5px' }}>
          <Button disabled={loading} fullWidth color="primary" variant="contained" onClick={() => searchData()}>
            {loading ? <CircularProgress size={12} /> : <Search fontSize="small" />}
          </Button>
        </Grid>

        {!loading && (
          <Grid item lg={1} sm={1} xs={1} sx={{ marginTop: '5px', display: 'flex', alignItems: 'center' }}>
            <ExcelButton data={data} title="" fileName={`${nomFile}.xlsx`} />
          </Grid>
        )}
      </Grid>

      <Grid>
        {data && (
          <DataGrid
            rows={data}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5
                }
              }
            }}
            pageSizeOptions={[15]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        )}
      </Grid>
    </Paper>
  );
}

export default Call;
