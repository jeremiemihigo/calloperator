/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import Chart from 'react-apexcharts';
import { Typography, Grid } from '@mui/material';

function StatistiqueCallOperator({ data }) {
  const [result, setResult] = React.useState({ options: [], series: [] });
  const loading = () => {
    let table = [];
    let series = [];
    let objects = _.toArray(Object.keys(_.countBy(data, 'agent.nom')));
    for (let i = 0; i < objects.length; i++) {
      table.push(objects[i]);
      series.push(data.filter((x) => x.agent.nom === objects[i]).length);
    }
    setResult({ series, options: table });
  };
  React.useEffect(() => {
    loading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  // eslint-disable-next-line prettier/prettier

  const options = {
    chart: {
      id: 'basic-bar'
    },
    xaxis: {
      categories: result.options
    }
  };
  const serie = [
    {
      name: 'series-1',
      data: result.series
    }
  ];
  return (
    <div className="app">
      <Grid className="pagesTitle">
        <Typography>Statistiques Call operator</Typography>
      </Grid>
      <div className="mixed-chart">
        <Chart options={options} series={serie} type="bar" width={450} height={300} />
      </div>
    </div>
  );
}

export default StatistiqueCallOperator;
