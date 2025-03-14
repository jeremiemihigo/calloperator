import { Grid } from '@mui/material';
import Call from 'pages/Portofolio/Feedback/Call';
import Historical from 'pages/Portofolio/Feedback/Historical';
import Liste from 'pages/Portofolio/Feedback/Liste';
import './feedback.style.css';

function AcceuilPage() {
  return (
    <Grid container className="fcontainer">
      <Grid item lg={3} sx={{ height: '100%' }}>
        <Liste />
      </Grid>
      <Grid item lg={7}>
        <Call />
      </Grid>
      <Grid item lg={2}>
        <Historical />
      </Grid>
    </Grid>
  );
}

export default AcceuilPage;
