import Chart from 'react-apexcharts';

const RadialBarChart = ({ nombre, texte }) => {
  const options = {
    chart: {
      height: 100,
      type: 'radialBar'
    },
    series: [nombre],
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 5,
          size: '70%'
        },
        dataLabels: {
          showOn: 'always',
          name: {
            offsetY: 0,
            show: false,
            color: '#888',
            fontSize: '5px'
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
    }
  };

  return (
    <>
      <p>{texte}</p>
      <Chart options={options} series={options.series} type="radialBar" height={200} />
    </>
  );
};

export default RadialBarChart;
