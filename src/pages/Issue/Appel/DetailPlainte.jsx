import { Button, Grid, Paper, Typography } from '@mui/material';
import axios from 'axios';
import { CreateContexteGlobal } from 'GlobalContext';
import React from 'react';
import { useSelector } from 'react-redux';
import { capitalizeFirstLetter, config, lien_issue, returnTime } from 'static/Lien';
import { CreateContexteTable } from './Contexte';

function DetailPlainte() {
  const { setClient, client } = React.useContext(CreateContexteGlobal);
  const { plainteSelect, setSelect } = React.useContext(CreateContexteTable);
  const deedline = useSelector((state) => state.delai.delai);
  const returnDelai = async (statut, today) => {
    if (deedline && today) {
      const a = _.filter(deedline, { plainte: statut });
      if (a.length > 0) {
        //si la plainte existe je cherche le jour
        let critere = a[0].critere.filter((x) => x.jour === today.day_of_week);
        if (critere.length > 0) {
          //si le critere existe
          let debutHeure = critere[0].debut.split(':')[0];
          let debutMinutes = critere[0].debut.split(':')[1];
          if (
            new Date(today.datetime).getHours() > parseInt(debutHeure) ||
            (new Date(today.datetime).getHours() === parseInt(debutHeure) &&
              new Date(today.datetime).getMinutes() >= parseInt(debutMinutes))
          ) {
            return critere[0]?.delai;
          } else {
            return a[0]?.defaut;
          }
        } else {
          return a[0]?.defaut;
        }
      } else {
        return 0;
      }
    }
  };
  const [today, setToday] = React.useState({
    datetime: new Date(),
    day_of_week: new Date().getDay()
  });

  async function getData() {
    const url = 'http://worldtimeapi.org/api/timezone/Africa/Lubumbashi';
    try {
      const response = await fetch(url, { method: 'GET' });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      setToday(json);
    } catch (error) {
      console.error(error.message);
    }
  }

  React.useEffect(() => {
    getData();
  }, []);
  const saveTicket = async (e) => {
    e.preventDefault();
    try {
      const delai = await returnDelai('Open_technician_visit', today);
      const datas = {
        ticket: plainteSelect.idPlainte,
        fullDate: today?.datetime,
        time_delai: delai,
        delai: plainteSelect.time_delai - returnTime(plainteSelect.fullDateSave, today?.datetime) > 0 ? 'IN SLA' : 'OUT SLA'
      };
      const response = await axios.post(lien_issue + '/create_ticket', datas, config);

      if (response.status === 200) {
        setClient(client.map((x) => (x._id === response.data._id ? response.data : x)));
        setSelect(5);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Grid container>
      <Grid item lg={8} xs={12} sm={4} md={4}>
        <Paper>
          <Grid sx={{ padding: '5px', backgroundColor: '#002d72', color: '#fff' }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 'bolder' }} noWrap>
              {plainteSelect?.nomClient}
            </Typography>
          </Grid>
          <Grid sx={{ padding: '5px' }}>
            <Grid container>
              <Grid item lg={6} xs={12} sm={6} md={6} className="grid">
                <Typography className="title">Ticket number</Typography>
                <Typography className="values">{plainteSelect.idPlainte}</Typography>
              </Grid>
              <Grid item lg={6} xs={12} sm={6} md={6} className="grid">
                <Typography className="title">Type Complaint</Typography>
                <Typography className="values">{plainteSelect.typePlainte}</Typography>
              </Grid>
              <Grid item lg={6} xs={12} sm={6} md={6} className="grid">
                <Typography className="title">ID</Typography>
                <Typography className="values">{plainteSelect.codeclient}</Typography>
              </Grid>
              <Grid item lg={6} xs={12} sm={6} md={6} className="grid">
                <Typography className="title">Contact</Typography>
                <Typography className="values">{plainteSelect?.contact}</Typography>
              </Grid>
              <Grid item lg={6} xs={12} sm={6} md={6} className="grid">
                <Typography className="title">type of intervention</Typography>
                <Typography className="values">{plainteSelect.plainteSelect}</Typography>
              </Grid>
              <Grid item lg={6} xs={12} sm={6} md={6} className="grid">
                <Typography className="title">Comment</Typography>
                <Typography className="values">{plainteSelect.recommandation}</Typography>
              </Grid>
              <Grid item lg={6} xs={12} sm={6} md={6} className="grid">
                <Typography className="title">Shop</Typography>
                <Typography className="values">{plainteSelect?.shop}</Typography>
              </Grid>
              <Grid item lg={6} xs={12} sm={6} md={6} className="grid">
                <Typography className="title">openBy</Typography>
                <Typography className="values">{plainteSelect?.submitedBy}</Typography>
              </Grid>

              <Grid item lg={6} xs={12} sm={6} md={6} className="grid">
                <Typography className="title">Status</Typography>
                <Typography className="values">{capitalizeFirstLetter(plainteSelect?.statut)}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item lg={4}>
        <Paper sx={{ padding: '10px', marginLeft: '5px' }}>
          {plainteSelect?.adresse ? (
            <>
              <p>Adresses</p>
              <p style={{ padding: '0px', margin: '0px 0px' }}>Commune : {plainteSelect?.adresse?.commune}</p>
              <p style={{ padding: '0px', margin: '10px 0px' }}>Quartier : {plainteSelect?.adresse?.quartier}</p>
              <p style={{ padding: '0px', margin: '0px' }}>Avenue : {plainteSelect?.adresse?.avenue}</p>
              <p style={{ padding: '0px', margin: '10px 0px' }}>
                SAT : {plainteSelect?.adresse?.sat?.nom_SAT}/ {plainteSelect?.adresse?.sat?.region}/ {plainteSelect?.adresse?.sat?.shop}
              </p>
              <p style={{ padding: '0px', margin: '0px' }}>Reference : {plainteSelect?.adresse?.reference}</p>
            </>
          ) : (
            <p>No address</p>
          )}
          <Button disabled={!today ? true : false} onClick={(e) => saveTicket(e)} variant="contained" color="primary" fullWidth>
            {!today ? 'Please wait' : 'Create'}
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default DetailPlainte;
