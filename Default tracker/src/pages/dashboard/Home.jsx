import { Grid, Paper } from '@mui/material';
import axios from 'axios';
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import LoaderGif from 'components/LoaderGif';
import React from 'react';
import { Line } from 'react-chartjs-2';
import { config, lien_dt } from 'static/Lien';
import PercentValidation from './PercentValidation';
import './table.css';

// Enregistrement des composants nécessaires pour Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale);

const HomePage = () => {
  const [data, setData] = React.useState();
  const [statut, setStatut] = React.useState();
  const loading = async () => {
    try {
      const response = await axios.get(lien_dt + '/graphique', config);

      if (response.status === 200) {
        setData({
          labels: response.data.table,
          datasets: [
            {
              label: 'Appel',
              data: response.data.appel,
              borderColor: '#007bff', // Couleur bleue
              backgroundColor: '#007bff',
              borderWidth: 2,
              pointStyle: 'circle',
              pointRadius: 4,
              pointBackgroundColor: '#007bff',
              fill: false,
              tension: 0.3
            },
            {
              label: 'Visite',
              data: response.data.visite,
              borderColor: '#00c853', // Couleur verte
              backgroundColor: '#00c853',
              borderWidth: 2,
              borderDash: [5, 5], // Pointillés
              pointStyle: 'circle',
              pointRadius: 4,
              pointBackgroundColor: '#00c853',
              fill: false,
              tension: 0.3
            },
            {
              label: 'Action',
              data: response.data.action,
              borderColor: '#ff9800', // Couleur orange
              backgroundColor: '#ff9800',
              borderWidth: 2,
              borderDash: [2, 2],
              pointStyle: 'triangle',
              pointRadius: 5,
              pointBackgroundColor: '#ff9800',
              fill: false,
              tension: 0.3
            }
          ]
        });
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
  }, []);
  // Données pour le graphique

  // Options de configuration du graphique
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'PAR 30+ tracking trend MAM'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Legende'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Values'
        },
        beginAtZero: true,
        ticks: {
          stepSize: 10
        }
      }
    }
  };
  const readDash = async () => {
    try {
      const response = await axios.get(lien_dt + '/statusDashboard', config);
      if (response.status === 200) {
        setStatut(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    readDash();
  }, []);

  return (
    <Grid className="content">
      <PercentValidation />
      <Paper elevation={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          {!data ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Paper
                sx={{ width: '7rem', margin: '10px', display: 'flex', padding: '10px', alignItems: 'center', justifyContent: 'center' }}
              >
                <div style={{ textAlign: 'center' }}>
                  <LoaderGif width={100} height={100} />
                  <p style={{ fontSize: '12px' }}>Laading...</p>
                </div>
              </Paper>
            </div>
          ) : (
            <Line data={data} options={options} />
          )}
        </div>
      </Paper>
      <Paper elevation={1} sx={{ padding: '10px', marginTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {statut && statut.length > 0 ? (
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
                  return (
                    <tr key={index._id}>
                      <td>{index.status}</td>
                      <td>{index.total}</td>
                      <td>
                        {index.role.map(function (x) {
                          return x.title + '; ';
                        })}
                      </td>
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
