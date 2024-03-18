/* eslint-disable react/prop-types */
import React from 'react';
import Chart from 'react-apexcharts';

function Chats({ series }) {
  const options = {
    chart: {
      id: 'basic-bar'
    },
    xaxis: {
      categories: ['superUser', 'admin', 'co']
    }
  };
  const serie = [
    {
      name: 'series-1',
      data: series
    }
  ];
  return (
    <div className="app">
      <div className="row">
        <div className="mixed-chart">
          <Chart options={options} series={serie} type="bar" width="400" />
        </div>
      </div>
    </div>
  );
}

export default Chats;
