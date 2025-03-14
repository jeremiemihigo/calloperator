import { Checkbox, Grid } from '@mui/material';
import React from 'react';
import { Paper } from '../../../../../node_modules/@mui/material/index';
import { ContextFeedback } from '../Context';
import Injoignable from './Injoignable';
import Joignable from './Joignable';
import Rappeler from './Rappeler';

function Index() {
  const { checked, setChecked } = React.useContext(ContextFeedback);

  return (
    <div className="feedback_liste">
      <Paper className="call_option" sx={{ marginBottom: '5px' }}>
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
      </Paper>
      {checked === 'joignable' && <Joignable />}
      {checked === 'injoignable' && <Injoignable />}
      {checked === 'rappeler' && <Rappeler />}
    </div>
  );
}

export default Index;
