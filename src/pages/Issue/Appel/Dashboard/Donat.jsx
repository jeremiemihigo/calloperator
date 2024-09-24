import React from 'react';
import ReactApexChart from 'react-apexcharts';

function ApexChart() {
  const [state] = React.useState({
    series: [44, 55],
    options: {
      chart: {
        width: 380,
        type: 'donut'
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 270
        }
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        type: 'gradient'
      },

      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    }
  });

  return (
    <div id="chart">
      <ReactApexChart options={state.options} series={state.series} type="donut" />
    </div>
  );
}

export default ApexChart;
