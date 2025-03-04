import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import { lien_dash } from 'static/Lien';
import { CircularProgress, Paper, Typography } from '../../../../node_modules/@mui/material/index';

// chart options

// ==============================|| SALES COLUMN CHART ||============================== //

const SalesColumnChart = () => {
  const theme = useTheme();
  const [types, setTypes] = React.useState('$region');

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const warning = theme.palette.warning.main;
  const primaryMain = theme.palette.primary.main;
  const successDark = theme.palette.success.dark;
  const [series, setSeries] = useState([
    {
      name: '',
      data: []
    }
  ]);

  const [options, setOptions] = useState({
    chart: {
      type: 'bar',
      height: 430,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '30%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 8,
      colors: ['transparent']
    },
    xaxis: {
      categories: []
    },
    yaxis: {
      title: {
        text: '$ (thousands)'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter(val) {
          return ` ${val} ${val > 1 ? 'actions' : 'action'}`;
        }
      }
    },
    legend: {
      show: true,
      fontFamily: `'Public Sans', sans-serif`,
      offsetX: 10,
      offsetY: 10,
      labels: {
        useSeriesColors: false
      },
      markers: {
        width: 16,
        height: 16,
        radius: '50%',
        offsexX: 2,
        offsexY: 2
      },
      itemMargin: {
        horizontal: 15,
        vertical: 50
      }
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          yaxis: {
            show: false
          }
        }
      }
    ]
  });
  const [load, setLoad] = React.useState(false);

  const loading = async () => {
    try {
      setLoad(true);
      const response = await axios.get(`${lien_dash}/graphique_decision/${types}`);
      if (response.status === 200) {
        setSeries(response.data.serie);
        setOptions((prevState) => ({
          ...prevState,
          xaxis: {
            categories: response.data.title
          }
        }));
        setLoad(false);
      }
    } catch (error) {}
  };
  useEffect(() => {
    loading();
  }, [types]);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [warning, primaryMain],
      xaxis: {
        labels: {
          style: {
            colors: [secondary, secondary, secondary, secondary, secondary, secondary]
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary]
          }
        }
      },
      grid: {
        borderColor: line
      },
      tooltip: {
        theme: 'light'
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        labels: {
          colors: 'grey.500'
        }
      }
    }));
  }, [primary, secondary, line, warning, primaryMain, successDark]);
  return (
    <>
      <div className="search">
        <Typography onClick={() => setTypes('$region')} component="p">
          Region
        </Typography>
        <Typography onClick={() => setTypes('$shop')} component="p">
          Shop
        </Typography>
      </div>
      {load ? (
        <div className="loading">
          <Paper elevation={1} className="load_papier">
            <CircularProgress size={15} />
            <p>Loading...</p>
          </Paper>
        </div>
      ) : (
        <ReactApexChart options={options} series={series} type="bar" height={430} />
      )}
    </>
  );
};

export default SalesColumnChart;
