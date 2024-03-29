// material-ui
import React from 'react';
import { Grid, List, ListItemButton, ListItemText, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import ReportAreaChart from './ReportAreaChart';
import FirstLogin from './FirstLogin.jsx';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
  const userConnect = useSelector((state) => state.user.user);
  const region = useSelector((state) => state.zone);
  const agent = useSelector((state) => state.agent);
  const periode = useSelector((state) => state.periodeActive);
  const reponse = useSelector((state) => state.reponse);

  const [statReponse, setStatReponse] = React.useState();

  React.useEffect(() => {
    if (reponse && reponse.reponse.length > 0) {
      let stat = _.groupBy(reponse.reponse, 'agent.nom');
      setStatReponse(Object.entries(stat));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reponse]);
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {userConnect && userConnect.first && <FirstLogin />}
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Régions enregistrées" count={region?.zone?.length} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Agents & Techniciens" count={agent?.agent?.length} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Mois actif" count={periode?.periodeActive?.periode} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Visites début du mois à date" count={reponse?.reponse.length} />
      </Grid>

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 3 */}
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Variation des visites</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <ReportAreaChart />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">stat C.O début du mois à date</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
            {!statReponse && <p style={{ textAlign: 'center' }}>Loading...</p>}
            {statReponse &&
              statReponse.map((index, key) => {
                return (
                  <ListItemButton divider key={key}>
                    <ListItemText primary={index[0]} />
                    <Typography variant="h5">{((index[1].length * 100) / reponse?.reponse.length).toFixed(0)}%</Typography>
                  </ListItemButton>
                );
              })}
          </List>
        </MainCard>
      </Grid>

      {/* row 4 */}
    </Grid>
  );
};

export default DashboardDefault;
