/* eslint-disable react/prop-types */
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography, Grid } from '@mui/material';

function ListeContrat({ data }) {
  const Difference = (debut, fin) => {
    return (new Date(fin).getTime() - new Date(debut).getTime()) / 86400000;
  };

  const resteConge = (donner) => {
    let conges = donner.conge;
    let reste = 0;
    for (let i = 0; i < conges.length; i++) {
      reste = reste + Difference(conges[i].debut, conges[i].fin);
    }
    return reste;
  };
  return (
    <Card sx={{ minWidth: 275, marginBottom: '3px' }}>
      <CardContent sx={{ display: 'flex', alignItem: 'center' }}>
        <img src="/profile.png" alt="prifiles" width={40} height={40} />
        <Grid sx={{ marginLeft: '10px' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bolder' }}>
            {data.agent.nom}
          </Typography>
          <Typography color="text.secondary">
            {data.conge.length < 1
              ? "L'agent n'a jamais pris le congé "
              : `
        L'agent a deja pris le congé ${data.conge.length} fois il lui reste ${resteConge(data)} jours
        `}
          </Typography>
        </Grid>
      </CardContent>
    </Card>
  );
}
export default ListeContrat;
