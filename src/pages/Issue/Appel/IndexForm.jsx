import { Grid, Paper, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import PropType from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import Form from './Form';
import HistoriqueClient from './HistoriqueClient';
import Liste from './Liste';
import Not_Our_Customer from './Not_Our_Customer';
import './style.css';

function IndexForm({ property }) {
  const [select, setSelected] = React.useState(0);
  const user = useSelector((state) => state.user?.user);

  const [formSelect, setFormSelect] = React.useState('our');

  return (
    <Grid container>
      <Grid item lg={5} xs={12} sm={12} md={6}>
        <Paper elevation={4} sx={{ padding: '10px' }}>
          <Box sx={{ display: 'flex' }}>
            <FormControl onClick={() => setFormSelect('our')} component="fieldset" variant="standard">
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={formSelect === 'our'} name="gilad" />} label="Our_customer" />
              </FormGroup>
            </FormControl>
            <FormControl onClick={() => setFormSelect('information')} required component="fieldset" variant="standard">
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={formSelect === 'information'} name="gilad" />} label="Information" />
              </FormGroup>
            </FormControl>
            {user && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography noWrap style={{ padding: '0px', margin: '0px', fontSize: '13px' }}>
                  {user.plainteShop && '' + user.plainteShop}
                </Typography>
              </div>
            )}
          </Box>
          {formSelect === 'our' && <Form />}
          {formSelect === 'information' && <Not_Our_Customer property={property} />}
        </Paper>
      </Grid>
      <Grid item lg={7} xs={12} sm={12} md={6}>
        <Paper elevation={4} sx={{ marginLeft: '10px' }}>
          <div className="titre">
            <Typography onClick={() => setSelected(0)}>Historique d&apos;appels</Typography>
            <Typography onClick={() => setSelected(1)}>Today</Typography>
          </div>
          {select === 0 && <HistoriqueClient />}
          {select === 1 && <Liste />}
        </Paper>
      </Grid>
    </Grid>
  );
}
IndexForm.propTypes = {
  property: PropType.string
};
export default React.memo(IndexForm);
