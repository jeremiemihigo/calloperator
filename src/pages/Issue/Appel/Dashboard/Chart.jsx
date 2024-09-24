import Chart from 'react-apexcharts';

const RadialBarChart = ({ texte, nombre }) => {
  const options = {
    chart: {
      height: 200,
      type: 'radialBar'
    },
    series: [nombre],
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 15,
          size: '70%'
        },
        dataLabels: {
          showOn: 'always',
          name: {
            offsetY: -10,
            show: true,
            color: '#888',
            fontSize: '13px'
          },
          value: {
            color: '#111',
            fontSize: '30px',
            show: true
          }
        }
      }
    },
    stroke: {
      lineCap: 'round'
    },
    labels: ['' + texte]
  };

  return (
    <div id="chart">
      <Chart options={options} series={options.series} type="radialBar" height={200} />
    </div>
  );
};

export default RadialBarChart;
