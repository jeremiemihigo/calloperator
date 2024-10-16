import { Grid, Paper, Typography } from '@mui/material';
import Dot from 'components/@extended/Dot';
import { CreateContexteGlobal } from 'GlobalContext';
import _ from 'lodash';
import React from 'react';
import { capitalizeFirstLetter, returnTime } from 'static/Lien';
import { useNavigate } from '../../../../node_modules/react-router-dom/dist/index';

function Dashboard() {
  const { client } = React.useContext(CreateContexteGlobal);

  const [statut, setStatut] = React.useState();
  const [statut_keys, setStatusKey] = React.useState();
  const structuration = () => {
    setStatut(_.groupBy(client, 'statut'));
    setStatusKey(Object.keys(_.groupBy(client, 'statut')));
  };
  React.useEffect(() => {
    structuration();
  }, [client]);

  function TimeCounterDelai(row) {
    const time = (row.time_delai - returnTime(row.fullDateSave, new Date()).toFixed(0)) * 60;
    if (time <= 0) {
      return 'OUT SLA';
    } else {
      return 'IN SLA';
    }
  }

  const ReturnDelai = (delai, result) => {
    let nombre = 0;
    for (let i = 0; i < result.length; i++) {
      if (TimeCounterDelai(result[i]) === delai) {
        nombre = nombre + 1;
      }
    }
    let pourcentage = (nombre * 100) / result.length;
    return !isNaN(pourcentage) ? pourcentage.toFixed(0) + '%' : '0%';
  };

  const navigation = useNavigate();
  const openDataTech = (e, data) => {
    e.preventDefault();
    const one = statut['' + data][0];
    if (one && one.type === 'ticket') {
      navigation('/tech_value', { state: { statut: data, state: '' } });
    } else {
      navigation('/n_tech_value', { state: { statut: one.statut, state: '' } });
    }
  };

  return (
    <Grid container>
      {statut_keys &&
        statut_keys.map((index) => {
          return (
            <Grid onClick={(e) => openDataTech(e, index)} item lg={4} xs={12} sm={12} md={6} key={index}>
              <Paper
                sx={{
                  padding: '5px',
                  margin: '3px'
                }}
                elevation={2}
              >
                <Typography noWrap sx={{ textAlign: 'center' }}>
                  {capitalizeFirstLetter(index)}
                </Typography>
                <Typography noWrap sx={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bolder' }}>
                  {statut && statut['' + index].length}
                </Typography>

                <div style={{ display: 'flex' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Dot color="error" />
                    <p style={{ padding: '0px', margin: '0px', marginLeft: '5px', fontWeight: 'bolder' }}>
                      {ReturnDelai('OUT SLA', statut['' + index])}
                    </p>
                  </div>
                  <div style={{ display: 'flex', marginLeft: '20px', alignItems: 'center', justifyContent: 'center' }}>
                    <Dot color="success" />
                    <p style={{ padding: '0px', margin: '0px', marginLeft: '5px', fontWeight: 'bolder' }}>
                      {ReturnDelai('IN SLA', statut['' + index])}
                    </p>
                  </div>
                </div>
              </Paper>
            </Grid>
          );
        })}
    </Grid>
  );
}

export default React.memo(Dashboard);
