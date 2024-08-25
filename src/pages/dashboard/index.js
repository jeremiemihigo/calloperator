// material-ui
import { Grid, List, Typography } from '@mui/material';
// project import
import { CreateContexteGlobal } from 'GlobalContext.jsx';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import React from 'react';
import { useSelector } from 'react-redux';
import { ListItemButton, ListItemText } from '../../../node_modules/@mui/material/index.js';
import FirstLogin from './FirstLogin.jsx';
import ReportAreaChart from './ReportAreaChart';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
  const userConnect = useSelector((state) => state.user.user);
  const agent = useSelector((state) => state.agent);
  const periode = useSelector((state) => state.periodeActive);
  const reponse = useSelector((state) => state.reponse.reponse);
  const { client, allListe } = React.useContext(CreateContexteGlobal);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {userConnect && userConnect.first && <FirstLogin />}
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce color="#efe9aa" title="Visites en attente" count={allListe?.length} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce color="#d4d5ed" title="Agents & Techniciens" count={agent?.agent?.length} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce color="#cdc8f4" title="Mois actif" count={periode?.periodeActive?.periode} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce color="#efe9aa" title="Complaints of today" count={client?.length} />
      </Grid>

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 3 */}
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Variation in household visits</Typography>
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
            <Typography variant="h5">Visits answered beginning of month to date</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
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
                        {index.nombre}
                      </Typography>
                    </ListItemButton>
                  );
                })
            }
          </List>
        </MainCard>
      </Grid>

      {/* row 4 */}
    </Grid>
  );
};

export default DashboardDefault;
