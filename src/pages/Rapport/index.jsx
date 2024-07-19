import { Call, MapsHomeWork } from '@mui/icons-material';
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
      <Grid item lg={4}>
        <Paper
          onClick={() => clic('/rapport/visit')}
          className="elementPaper"
          sx={{ height: '5rem', margin: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div className="element">
            <MapsHomeWork />
            <p>household visit</p>
          </div>
        </Paper>
      </Grid>
      <Grid item lg={4}>
        <Paper
          onClick={() => clic('/rapport/call')}
          className="elementPaper"
          sx={{ height: '5rem', margin: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div className="element">
            <Call />
            <p>Call</p>
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Index;
