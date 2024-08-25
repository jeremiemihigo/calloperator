/* eslint-disable react/prop-types */
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import Chart from 'react-apexcharts';

function StatistiqueCallOperator({ data }) {
  const [result, setResult] = React.useState({ options: [], series: [] });
  const loading = () => {
    let table = [];
    let series = [];
    let objects = _.toArray(Object.keys(_.countBy(data, 'submitedBy')));
    for (let i = 0; i < objects.length; i++) {
      table.push(objects[i]);
      series.push(data.filter((x) => x.submitedBy === objects[i]).length);
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
    <div className="mixed-chart">
      <Chart options={options} series={serie} type="bar" width="100%" height={300} />
    </div>
  );
}
StatistiqueCallOperator.propTypes = {
  data: PropTypes.array
};
export default StatistiqueCallOperator;
