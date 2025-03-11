import { ContactPhone, Handyman, MapsHomeWork, SupportAgent } from '@mui/icons-material';
import { Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './style.css';

function Index() {
  const navigation = useNavigate();

  const clic = (link) => {
    navigation(link);
  };
  return (
    <Grid container>
      <Grid item lg={3} xs={12} sm={6} md={4}>
        <Paper
          onClick={() => clic('/r_visit')}
          className="elementPaper"
          sx={{ height: '5rem', margin: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div className="element">
            <MapsHomeWork />
            <p>household visit</p>
          </div>
        </Paper>
      </Grid>

      <Grid item lg={3} xs={12} sm={6} md={4}>
        <Paper
          onClick={() => clic('/r_technical')}
          className="elementPaper"
          sx={{ height: '5rem', margin: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div className="element">
            <Handyman />
            <p>Technical issue</p>
          </div>
        </Paper>
      </Grid>
      <Grid item lg={3} xs={12} sm={6} md={4}>
        <Paper
          onClick={() => clic('/r_callclient')}
          className="elementPaper"
          sx={{ height: '5rem', margin: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div className="element">
            <ContactPhone />
            <p>All contacts of the customer</p>
          </div>
        </Paper>
      </Grid>
      <Grid item lg={3} xs={12} sm={6} md={4}>
        <Paper
          onClick={() => clic('/r_callback')}
          className="elementPaper"
          sx={{ height: '5rem', margin: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div className="element">
            <SupportAgent />
            <p>Customer to call back</p>
          </div>
        </Paper>
      </Grid>
      <Grid item lg={3} xs={12} sm={6} md={4}>
        <Paper
          onClick={() => clic('/r_renseignement')}
          className="elementPaper"
          sx={{ height: '5rem', margin: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div className="element">
            <SupportAgent />
            <p>Information</p>
          </div>
        </Paper>
      </Grid>
      <Grid item lg={3} xs={12} sm={6} md={4}>
        <Paper
          onClick={() => clic('/r_portofolio')}
          className="elementPaper"
          sx={{ height: '5rem', margin: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div className="element">
            <SupportAgent />
            <p>Portofolio</p>
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Index;
