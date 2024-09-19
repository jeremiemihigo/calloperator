import { Grid, Paper, Typography } from '@mui/material';
import { CreateContexteGlobal } from 'GlobalContext';
import _ from 'lodash';
import React from 'react';
import { capitalizeFirstLetter } from 'static/Lien';

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

  return (
    <Grid container>
      {statut_keys &&
        statut_keys.map((index) => {
          return (
            <Grid item lg={4} xs={12} sm={12} md={6} key={index}>
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
              </Paper>
            </Grid>
          );
        })}
    </Grid>
  );
}

export default React.memo(Dashboard);
