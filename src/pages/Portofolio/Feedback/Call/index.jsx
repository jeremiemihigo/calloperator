import { Checkbox, Grid } from '@mui/material';
import React from 'react';
import { ContextFeedback } from '../Context';
import Injoignable from './Injoignable';
import Joignable from './Joignable';
import Rappeler from './Rappeler';

function Index() {
  const { checked, setChecked } = React.useContext(ContextFeedback);

  return (
    <div>
      <div className="call_title">
        <p className="call_late">Late and Default calls</p>
        <p className="call_subtitle">L&apos;appel pour les clients qui sont expirés</p>
      </div>
      <div className="call_option">
        <Grid className="call_option_item" onClick={() => setChecked('joignable')}>
          <Checkbox checked={checked === 'joignable'} />
          <p>Reachable</p>
        </Grid>
        <Grid className="call_option_item" onClick={() => setChecked('injoignable')}>
          <Checkbox checked={checked === 'injoignable'} />
          <p>Unreachable</p>
        </Grid>
        <Grid className="call_option_item" onClick={() => setChecked('rappeler')}>
          <Checkbox checked={checked === 'rappeler'} />
          <p>Remind</p>
        </Grid>
      </div>
      {checked === 'joignable' && <Joignable />}
      {checked === 'injoignable' && <Injoignable />}
      {checked === 'rappeler' && <Rappeler />}
    </div>
  );
}

export default Index;
