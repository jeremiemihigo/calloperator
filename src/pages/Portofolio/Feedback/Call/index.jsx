import { Checkbox, Grid } from '@mui/material';
import React from 'react';
import Injoignable from './Injoignable';
import Joignable from './Joignable';
import Rappeler from './Rappeler';

function Index() {
  const [checked, setChecked] = React.useState('');
  return (
    <div>
      <div className="call_title">
        <p className="call_late">Late and Default calls</p>
        <p className="call_subtitle">L&apos;appel pour les clients qui sont expirés</p>
      </div>
      <div className="call_option">
        <Grid className="call_option_item" onClick={() => setChecked('joignable')}>
          <Checkbox checked={checked === 'joignable'} />
          <p>Joignable</p>
        </Grid>
        <Grid className="call_option_item" onClick={() => setChecked('injoignable')}>
          <Checkbox checked={checked === 'injoignable'} />
          <p>Injoignable</p>
        </Grid>
        <Grid className="call_option_item" onClick={() => setChecked('rappeler')}>
          <Checkbox checked={checked === 'rappeler'} />
          <p>A rappeler</p>
        </Grid>
      </div>
      {checked === 'joignable' && <Joignable />}
      {checked === 'injoignable' && <Injoignable />}
      {checked === 'rappeler' && <Rappeler />}
    </div>
  );
}

export default Index;
