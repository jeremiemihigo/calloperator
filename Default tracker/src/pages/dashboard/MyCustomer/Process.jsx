import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import { CircularProgress, Paper, Typography } from '@mui/material';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import { config, lien_dash } from 'static/Lien';

// chart options

// ==============================|| SALES COLUMN CHART ||============================== //

const SalesColumnChart = () => {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const warning = theme.palette.warning.main;
  const primaryMain = theme.palette.primary.main;
  const successDark = theme.palette.success.dark;
  const [search, setSearch] = React.useState('$region');

  const [series, setSeries] = useState([]);

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
        columnWidth: '50%',
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

    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter(val) {
          return `${val}`;
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
  const [load, setLoad] = React.useState(false);
  const loading = async () => {
    try {
      setLoad(true);
      const response = await axios.get(`${lien_dash}/inactif/${search}`, config);
      console.log(response);
      if (response.status === 200) {
        setSeries([
          {
            name: 'In Process',
            data: response.data.process
          },
          {
            name: 'End Process',
            data: response.data.not_process
          }
        ]);
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
  }, [search]);

  return (
    <Paper>
      <div className="search">
        <Typography onClick={() => setSearch('$region')} component="p">
          Region
        </Typography>
        <Typography onClick={() => setSearch('$shop')} component="p">
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
        <ReactApexChart options={options} width="100%" series={series} type="bar" height={430} />
      )}
    </Paper>
  );
};

export default SalesColumnChart;
