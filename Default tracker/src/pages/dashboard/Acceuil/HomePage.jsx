import { Grid, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import DirectionSnackbar from 'components/Direction';
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { config, lien_dt } from 'static/Lien';
import { CircularProgress } from '../../../../node_modules/@mui/material/index';
import { CreateContexteHome } from './Context';
import Filtre from './Filtre';
import PercentValidation from './PercentValidation';
import './table.css';

// Enregistrement des composants nécessaires pour Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale);

const HomePage = () => {
  const [statut, setStatut] = React.useState();
  const [message, setMessage] = React.useState('');
  const { match, load, setLoad } = React.useContext(CreateContexteHome);
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const warning = theme.palette.warning.main;
  const primaryMain = theme.palette.primary.main;
  const successDark = theme.palette.success.dark;
  const [series, setSeries] = React.useState([]);
  const [options, setOptions] = React.useState({
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
  React.useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [warning, primaryMain, successDark],
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
  const loading = async () => {
    try {
      setLoad({ ...load, deux: true });
      const response = await axios.post(lien_dt + '/graphique', { match }, config);
      if (response.status === 200 && response.data.table) {
        setSeries([
          {
            name: 'Action',
            data: response.data.action
          },
          {
            name: 'Appel',
            data: response.data.appel
          },
          {
            name: 'Visite',
            data: response.data.visite
          }
        ]);
        setOptions((prevState) => ({
          ...prevState,
          xaxis: {
            categories: response.data.table
          }
        }));
        setLoad({ ...load, deux: false });
      }
      if (response.status === 201) {
        setMessage(response.data);
        setLoad({ ...load, deux: false });
      }
      if (response.data === 'token expired') {
        window.location.replace('/login');
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loading();
  }, [match]);

  const readDash = async () => {
    try {
      setLoad({ ...load, trois: true });
      const response = await axios.post(lien_dt + '/statusDashboard', config);
      if (response.status === 200) {
        setStatut(response.data);
        setLoad({ ...load, trois: false });
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    readDash();
  }, [match]);

  const returnInCharge = (index) => {
    if (index.role.length > 0) {
      return index.role.map(function (x) {
        return x.title + '; ';
      });
    }
    if (index.poste.length > 0) {
      return index.poste.map(function (x) {
        return x.title + '; ';
      });
    }
  };
  return (
    <Grid className="content">
      {message && <DirectionSnackbar message={message} />}
      <Filtre />
      <PercentValidation />
      <Paper elevation={1} sx={{ padding: '10px' }}>
        <div style={{ width: '100%' }}>
          <p>Visits of this month to date</p>
          {load.deux && (
            <div className="loading">
              <Paper elevation={1} className="load_papier">
                <CircularProgress size={15} />
                <p>Loading...</p>
              </Paper>
            </div>
          )}
          {series.length > 0 && <ReactApexChart options={options} width="100%" series={series} type="bar" height={430} />}
        </div>
      </Paper>
      <Paper elevation={1} sx={{ padding: '10px', marginTop: '10px' }}>
        {load.trois && (
          <div className="loading">
            <Paper elevation={1} className="load_papier">
              <CircularProgress size={15} />
              <p>Loading...</p>
            </Paper>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {!load.trois && statut && statut.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <td>Status</td>
                  <td>Total customer</td>
                  <td>In charge</td>
                </tr>
              </thead>
              <tbody>
                {statut?.map((index) => {
                  console.log(index);
                  return (
                    <tr key={index._id}>
                      <td>{index.status}</td>
                      <td>{index.total}</td>
                      <td>{returnInCharge(index)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p style={{ textAlign: 'center' }}>Loading...</p>
          )}
        </div>
      </Paper>
    </Grid>
  );
};

export default HomePage;
