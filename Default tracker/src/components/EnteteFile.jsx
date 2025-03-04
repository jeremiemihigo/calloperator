import { Paper } from '../../node_modules/@mui/material/index';

function EnteteFile({ texte }) {
  return (
    <Paper sx={{ padding: '10px' }}>
      <p style={{ padding: '0px', margin: '0px', fontWeight: 'bolder', fontSize: '15px' }}>{texte}</p>
    </Paper>
  );
}

export default EnteteFile;
