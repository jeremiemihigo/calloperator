import { Paper, Typography } from '@mui/material';

function Datastucture({ title, subtitle, nombre }) {
  return (
    <Paper elevation={3} sx={style.paper}>
      <Typography component="p" sx={style.padding0}>
        {title}
      </Typography>
      <div className="Unaffected">
        <div>
          <Typography component="p" className="Unaffected_title">
            {subtitle}
          </Typography>
          <Typography component="p" className="Unaffected_number">
            {nombre}
          </Typography>
        </div>
      </div>
    </Paper>
  );
}
const style = {
  padding0: {
    padding: '0px',
    margin: '0px',
    textAlign: 'center'
  },
  paper: {
    padding: '10px',
    margin: '5px',
    height: '100%'
  }
};
export default Datastucture;
