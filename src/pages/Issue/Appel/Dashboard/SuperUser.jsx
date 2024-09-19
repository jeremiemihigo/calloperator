import { Grid, Paper } from '@mui/material';
import { animated, useSpring } from 'react-spring';
import Donut from './Donat';
import SalesColumn from './SalesColumnChart';
import './style.dashboard.css';

function Number(n) {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 }
  });
  return <animated.p>{number.to((n) => n.toFixed(0))}</animated.p>;
}
function SuperUser() {
  const data = [
    { id: 1, title: 'No technical Issues' },
    { id: 2, title: 'Technical Issues' },
    { id: 3, title: 'Back Office' },
    { id: 4, title: 'Relocation' }
  ];

  return (
    <>
      <Paper elevation={3} sx={{ padding: '10px' }}>
        <div className="dashboard-content">
          <div className="dashboard-title">
            <p>Dashboard Super_user for this month</p>
          </div>
          <div className="dashboard-subtitle">
            <p>In your dashboard, you can see all actions from evry shop</p>
          </div>
        </div>
      </Paper>
      <Grid container sx={{ marginTop: '10px' }}>
        {data.map((index) => {
          return (
            <Grid item lg={3} key={index.id} className="item-title">
              <Paper elevation={1} sx={{ padding: '5px', height: '90%', margin: '3px' }}>
                <div>
                  <p className="margin-zero titlezero">{index.title}</p>
                </div>
                <div className="deedline-title">
                  <div className="insla display-flex">
                    <div>
                      <div className="number">
                        {Number(100)}
                        <span>%</span>
                      </div>
                      <p className="titre">IN SLA</p>
                    </div>
                  </div>
                  <div className="outsla display-flex">
                    <div>
                      <div className="number">
                        {Number(80)}
                        <span>%</span>
                      </div>
                      <p className="titre">OUT SLA</p>
                    </div>
                  </div>
                </div>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      <Grid container sx={{ marginTop: '5px' }}>
        <Grid item lg={8} sx={{ padding: '3px' }}>
          <Paper elevation={3} sx={{ padding: '5px', height: '100%' }}>
            <div style={{ margin: '10px' }}>
              <p style={{ padding: '0px', margin: '0px', fontSize: '15px', fontWeight: 'bolder' }}>Technical complaint resolution</p>
            </div>
            <SalesColumn />
          </Paper>
        </Grid>
        <Grid item lg={4}>
          <Paper elevation={2} sx={{ padding: '3px' }}>
            <Donut title="Operator who received fewer calls" />
          </Paper>
          <Paper elevation={2} sx={{ padding: '3px', marginTop: '2px' }}>
            <Donut title="The shop that receives fewer customers" />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default SuperUser;
