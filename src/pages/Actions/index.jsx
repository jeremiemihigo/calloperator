/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Button, Paper, Grid } from '@mui/material';
import { Attractions } from '@mui/icons-material';
import axios from 'axios';
import { lien, config } from 'static/Lien';
import { Input } from 'antd';
import { DataGrid } from '@mui/x-data-grid';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import _ from 'lodash';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import BasicTab from 'Control/Tabs';
import DemandeAction from './DemandeAction';
import Creer from './Creer';
import Client from './Client';
import './style.css';

function Rapport() {
  const [dates, setDates] = React.useState({ debut: '', fin: '' });
  const [donnerFound, setDonnerFound] = React.useState();

  const [loading, setLoading] = React.useState(false);
  const [clientSelect, setClientSelect] = React.useState();
  const columns = [
    {
      field: 'codeclient',
      headerName: 'Code client',
      width: 120,
      editable: false
    },
    {
      field: 'nomClient',
      headerName: 'Nom',
      width: 150,
      editable: false
    },
    {
      field: 'clientStatut',
      headerName: 'Statut client',
      width: 80,
      editable: false
    },
    {
      field: 'PayementStatut',
      headerName: 'Stat.payement',
      width: 100,
      editable: false
    },
    {
      field: 'consExpDays',
      headerName: 'consExpDays',
      width: 50,
      editable: false
    },
    {
      field: 'lot',
      headerName: 'Mois',
      width: 60,
      editable: false,
      renderCell: (params) => {
        return params.row.demande.lot;
      }
    },
    {
      field: 'Actions',
      headerName: 'Actions',
      width: 50,
      editable: false,
      renderCell: (params) => {
        return <Attractions onClick={() => setClientSelect(params.row)} sx={{ cursor: 'pointer' }} fontSize="small" color="primary" />;
      }
    }
  ];
  const searchData = React.useCallback(
    () => {
      setLoading(true);
      let data = {
        debut: dates.debut,
        fin: dates.fin
      };
      axios
        .post(lien + '/rapport', data, config)

        .then((response) => {
          if (response.data === 'token expired') {
            localStorage.removeItem('auth');
            window.location.replace('/login');
          } else {
            if (response.data.error) {
              setLoading(false);
              alert(response.data.message);
            } else {
              let table = [];
              for (let i = 0; i < response.data.length; i++) {
                response.data[i].id = i;
                table.push(response.data[i]);
              }
              setDonnerFound(table);
              setLoading(false);
            }
          }
        })
        .catch(function (err) {
          console.log(err);
        });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dates]
  );
  const [setting, setSettings] = React.useState({ statutClient: [], statutPayement: [] });
  const { statutClient, statutPayement } = setting;

  React.useEffect(() => {
    if (donnerFound) {
      setSettings({
        statutClient: _.uniqBy(donnerFound, 'clientStatut'),
        statutPayement: _.uniqBy(donnerFound, 'PayementStatut')
      });
    }
  }, [donnerFound]);

  const [valueSelect, setValueSelect] = React.useState({ payement: '', client: '' });
  const { payement, client } = valueSelect;

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setValueSelect({
      ...valueSelect,
      [name]: value
    });
  };

  const handleRecherche = () => {
    if (payement !== '' || client !== '') {
      return donnerFound.filter((x) => client !== '' && x.clientStatut === client && payement !== '' && x.PayementStatut === payement);
    } else {
      return donnerFound;
    }
  };
  React.useEffect(() => {
    handleRecherche();
  }, [payement, client]);

  const title = [
    { id: 0, label: 'Create' },
    { id: 1, label: 'All' },
    { id: 2, label: 'Customer' }
  ];
  const component = [
    { id: 0, component: <Creer client={clientSelect} /> },
    { id: 1, component: <DemandeAction client={donnerFound} /> },
    { id: 2, component: <Client /> }
  ];
  return (
    <Paper sx={{ padding: '5px' }} elevation={3}>
      <Grid container>
        <Grid item lg={3} sm={3} xs={12} sx={{ marginTop: '5px', paddingRight: '5px' }}>
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
        <Grid item lg={3} sm={3} xs={12} sx={{ marginTop: '5px', paddingRight: '5px' }}>
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
        <Grid item lg={2} sm={2} xs={12} sx={{ marginTop: '5px', paddingRight: '5px' }}>
          <Button disabled={loading} fullWidth color="primary" variant="contained" onClick={() => searchData()}>
            <FilterAltIcon fontSize="small" /> {loading ? 'Loading...' : 'Filtrer'}
          </Button>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item lg={8}>
          <Grid container sx={{ marginTop: '10px' }}>
            <Grid item lg={3} sx={{ paddingRight: '5px' }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label0">Statut client</InputLabel>
                <Select onChange={handleChange} name="client" labelId="demo-simple-select-label0" id="demo-simple-select0">
                  {statutClient.map((index) => {
                    return (
                      <MenuItem key={index._id} value={index.clientStatut}>
                        {index.clientStatut}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item lg={3}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label1">Statut payement</InputLabel>
                <Select onChange={handleChange} name="payement" labelId="demo-simple-select-label1" id="demo-simple-select1">
                  {statutPayement.map((index) => {
                    return (
                      <MenuItem key={index._id} value={index.PayementStatut}>
                        {index.PayementStatut}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {donnerFound && (
            <DataGrid
              rows={handleRecherche()}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10
                  }
                }
              }}
              pageSizeOptions={[10]}
              checkboxSelection
              disableRowSelectionOnClick
            />
          )}
        </Grid>
        <Grid item lg={4}>
          <BasicTab titres={title} components={component} />
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Rapport;
