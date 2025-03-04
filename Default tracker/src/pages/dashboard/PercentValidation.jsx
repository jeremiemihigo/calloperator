import { Grid, Paper } from '@mui/material';
import axios from 'axios';
import RadialBarChart from 'pages/Component/RadialBarChart';
import React from 'react';
import CountUp from 'react-countup';
import { config, lien_dt } from 'static/Lien';
import './dashboarddept.style.css';

function PercentValidation() {
  //percentvalidation
  const [data, setData] = React.useState({
    nombre: 0,
    visite: 0,
    action: 0,
    appel: 0
  });
  const [load, setLoad] = React.useState(true);
  const { nombre, visite, action, appel } = data;
  const loading = async () => {
    try {
      setLoad(true);
      const response = await axios.get(lien_dt + '/graphique_taux', config);
      if (response.status === 200) {
        setData(response.data);
        setLoad(false);
      }
      if (response.data === 'token expired') {
        window.location.replace('/login');
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loading();
  }, []);

  return (
    <>
      <Grid container>
        <Grid item lg={3} xs={12} md={3} sm={6} sx={{ padding: '10px' }}>
          <Paper className="paper_" elevation={1} sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {load ? (
              <p>Loading...</p>
            ) : (
              <div>
                <p style={{ padding: '0px', margin: '0px' }}>PAR 30+</p>
                <p style={{ fontSize: '40px', fontWeight: 'bolder', padding: '0px', margin: '0px' }}>
                  <CountUp start={0} end={nombre || 0} duration={2.5} />
                </p>
                <p style={{ textAlign: 'center', fontSize: '11px' }}>Customers to track</p>
              </div>
            )}
          </Paper>
        </Grid>
        <Grid item lg={3} xs={12} md={3} sm={6} sx={{ padding: '10px' }}>
          <Paper className="paper_" elevation={1}>
            {load ? <p>Loading...</p> : <RadialBarChart texte="Call percentage" nombre={appel} />}
          </Paper>
        </Grid>
        <Grid item lg={3} xs={12} md={3} sm={6} sx={{ padding: '10px' }}>
          <Paper className="paper_" elevation={1}>
            {load ? <p>Loading...</p> : <RadialBarChart texte="Percentage of visits" nombre={visite} />}
          </Paper>
        </Grid>
        <Grid item lg={3} xs={12} md={3} sm={6} sx={{ padding: '10px' }}>
          <Paper className="paper_" elevation={1}>
            {load ? <p>Loading...</p> : <RadialBarChart texte="Percentage of actions" nombre={action} />}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default PercentValidation;
