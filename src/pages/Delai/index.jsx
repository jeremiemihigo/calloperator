import { Grid } from '@mui/material';
import _ from 'lodash';
import React from 'react';
import { Paper } from '../../../node_modules/@mui/material/index';
import { useSelector } from '../../../node_modules/react-redux/es/exports';
import Formulaire from './Formulaire';
import './style.css';

function Index() {
  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const plainte = [
    { id: 0, title: 'Back office', value: 'escalade' },
    { id: 1, title: 'Resolved awaiting confirmation', value: 'resolved_awaiting_confirmation' },
    { id: 2, title: 'Open_technician_visit', value: 'Open_technician_visit' },
    { id: 3, title: 'Awaiting confirmation', value: 'awaiting_confirmation' },
    { id: 4, title: 'Not_resolved', value: 'Not_resolved' },
    { id: 5, title: 'Ongoing', value: 'Ongoing' }
  ];
  const [plainteSelect, setPlainteSelect] = React.useState('');
  const delai = useSelector((state) => state.delai?.delai);
  const [show, setShow] = React.useState();
  React.useEffect(() => {
    setShow(_.filter(delai, { plainte: plainteSelect }));
  }, [plainteSelect]);
  console.log(show);
  return (
    <>
      <Grid container>
        <Grid item lg={4}>
          {plainte.map((index) => {
            return (
              <Grid
                onClick={() => setPlainteSelect(index.value)}
                key={index.id}
                className={index.value === plainteSelect ? 'plainte select' : 'plainte'}
              >
                <p>{index.title}</p>
              </Grid>
            );
          })}
        </Grid>
        <Grid item lg={8} sx={{ padding: '0px 10px' }}>
          <Formulaire plainteSelect={plainteSelect} />
          <Grid sx={{ marginTop: '15px' }}>
            {show &&
              show.length > 0 &&
              show[0].critere.length > 0 &&
              show[0].critere.map((index, key) => {
                return (
                  <Paper sx={{ padding: '5px', marginBottom: '5px' }} key={key} elevation={1}>
                    {jours[index.jour]}; de {index.debut}; delai : {index.delai + 'minutes'}
                  </Paper>
                );
              })}
            {show && show.length > 0 && (
              <Paper sx={{ padding: '5px', marginTop: '5px' }} elevation={1}>
                Default; delai : {show[0]?.defaut + 'minutes'}
              </Paper>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default Index;
