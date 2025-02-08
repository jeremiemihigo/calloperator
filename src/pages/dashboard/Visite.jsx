// material-ui
import { Grid, List, Typography } from '@mui/material';
// project import
// import AudioRecorder from 'pages/Audio/index.jsx';
import { ListItemButton, ListItemText } from '@mui/material';
import CountUp from 'react-countup';
import { useSelector } from 'react-redux';
import { Paper } from '../../../node_modules/@mui/material/index.js';
import FirstLogin from './FirstLogin.jsx';
import ReportAreaChart from './ReportAreaChart';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
  const userConnect = useSelector((state) => state.user.user);
  const reponse = useSelector((state) => state.reponse.reponse);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {userConnect && userConnect.first && <FirstLogin />}

      {/* row 3 */}
      <Grid item xs={12} md={7} lg={8}>
        <Paper sx={{ padding: '5px' }} elevation={2}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h6">Variation in household visits</Typography>
            </Grid>
            <Grid item />
          </Grid>

          <ReportAreaChart />
        </Paper>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Paper elevation={2} sx={{ padding: '5px' }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h6">This month to date </Typography>
            </Grid>
            <Grid item />
          </Grid>

          <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
            {!reponse && <p style={{ textAlign: 'center' }}>Loading...</p>}
            {
              // reponse && reponse.length > 0 && <Graphique clients={reponse} />
              reponse &&
                reponse.length > 0 &&
                reponse.map((index, key) => {
                  return (
                    <ListItemButton divider key={key}>
                      <ListItemText primary={index._id} />
                      <Typography sx={{ marginLeft: '10px' }} variant="h5">
                        <CountUp start={0} end={index.nombre || 0} duration={2.5} />
                      </Typography>
                    </ListItemButton>
                  );
                })
            }
          </List>
        </Paper>
      </Grid>

      {/* row 4 */}
    </Grid>
  );
};

export default DashboardDefault;
