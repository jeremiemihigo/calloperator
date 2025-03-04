import { Grid, Paper, Tooltip, Typography } from '@mui/material';
import MyDot from 'pages/mesClients/Affichage/MyDot';
import PropType from 'prop-types';

function ActionPending({ action, role, nombre, outsla, insla, bg }) {
  return (
    <Tooltip title={action}>
      <Paper elevation={2} sx={{ padding: '5px', backgroundColor: bg }}>
        <Typography noWrap style={{ fontSize: '12px', textAlign: 'center', fontWeight: 700 }}>
          {action}
        </Typography>
        <Typography component="p" sx={{ fontSize: '11px', textAlign: 'center', padding: '0px', margin: '0px' }}>
          {role}
        </Typography>
        <p style={{ fontSize: '25px', textAlign: 'center', fontWeight: 'bolder' }}>{JSON.stringify(nombre)}</p>
        <Grid sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Grid sx={style.flex}>
            <Grid sx={style.flexOutsla}>
              <MyDot texte="error" value={outsla} />
            </Grid>
            <Grid sx={style.flexInsla}>
              <MyDot texte="success" value={insla} />
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Tooltip>
  );
}
const style = {
  flex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  flexOutsla: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '10px'
  },
  flexInsla: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
ActionPending.prototype = {
  action: PropType.string,
  role: PropType.string,
  nombre: PropType.number,
  outsla: PropType.number,
  insla: PropType.number,
  lastupdate: PropType.string,
  bg: PropType.string
};
export default ActionPending;
