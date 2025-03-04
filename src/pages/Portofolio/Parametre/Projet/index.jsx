import { Grid } from '@mui/material';
import Form from 'pages/Portofolio/Parametre/Projet/Form';
import { useSelector } from 'react-redux';
import ListeProjet from './ListeProjet';

function Projet() {
  const liste = useSelector((state) => state.projet.projet);
  return (
    <Grid container>
      <Grid item lg={4}>
        <Form />
      </Grid>
      <Grid item lg={8}>
        <Grid container>
          {liste &&
            liste.map((index) => {
              return (
                <Grid item lg={6} key={index._id}>
                  <ListeProjet projet={index} />
                </Grid>
              );
            })}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Projet;
