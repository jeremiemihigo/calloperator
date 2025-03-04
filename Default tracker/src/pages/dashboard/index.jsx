import { BarChartOutlined, HomeOutlined, InteractionOutlined, NodeCollapseOutlined, UserOutlined } from '@ant-design/icons';
import { Grid, Paper } from '@mui/material';
import React from 'react';
import Action from './Action';
import Arbitrage from './Arbitrage';
import Decision from './Decision';
import HomePage from './Home';
import MyCustomer from './MyCustomer';
import Performance from './Performance';
import './table.css';

// Enregistrement des composants nécessaires pour Chart.js

const LineChart = () => {
  const [select, setSelect] = React.useState(0);

  return (
    <Grid container>
      <Grid className="options" item lg={1}>
        <Paper className={`${select === 0 ? 'active option' : 'option'}`} onClick={() => setSelect(0)}>
          <HomeOutlined />
          <p>Home</p>
        </Paper>
        <Paper className={`${select === 1 ? 'active option' : 'option'}`} onClick={() => setSelect(1)}>
          <UserOutlined />
          <p>My customer</p>
        </Paper>

        <Paper className={`${select === 3 ? 'active option' : 'option'}`} onClick={() => setSelect(3)}>
          <InteractionOutlined />
          <p>Actions</p>
        </Paper>
        <Paper className={`${select === 4 ? 'active option' : 'option'}`} onClick={() => setSelect(4)}>
          <NodeCollapseOutlined />
          <p>Decisions</p>
        </Paper>

        <Paper
          className={`${select === 2 ? 'active option' : 'option'}`}
          // onClick={() => setSelect(2)}
        >
          <BarChartOutlined />
          <p>Arbitration</p>
        </Paper>
        <Paper className={`${select === 5 ? 'active option' : 'option'}`} onClick={() => setSelect(5)}>
          <BarChartOutlined />
          <p>Performance</p>
        </Paper>
      </Grid>
      <Grid item lg={11} className="content">
        {select === 0 && <HomePage />}
        {select === 1 && <MyCustomer />}
        {select === 2 && <Arbitrage />}
        {select === 3 && <Action />}
        {select === 4 && <Decision />}
        {select === 5 && <Performance />}
      </Grid>
    </Grid>
  );
};

export default LineChart;
