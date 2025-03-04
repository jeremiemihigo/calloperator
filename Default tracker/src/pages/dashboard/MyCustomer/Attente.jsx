import { CircularProgress, Paper } from '@mui/material';
import axios from 'axios';
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { config, lien_dash } from 'static/Lien';
import './style.css';

function Attente() {
  const [load, setLoad] = React.useState(false);
  const [state, setState] = React.useState({
    series: [],
    options: {
      chart: {
        width: 300, // Augmentation de la largeur
        height: 300, // Ajout de la hauteur (optionnel)
        type: 'donut' // Assurez-vous que le type est "donut"
      },
      labels: [], // Labels initialisés à vide
      legend: {
        show: true,
        position: 'bottom',
        fontSize: '13px',
        labels: {
          colors: ['#333']
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300 // Taille réduite pour les petits écrans
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    }
  });

  const loading = async () => {
    try {
      setLoad(true);
      const response = await axios.get(lien_dash + '/attente_department', config);
      if (response.status === 200) {
        setState((prevState) => ({
          ...prevState,
          series: response.data.serie,
          options: {
            ...prevState.options,
            labels: response.data.label
          }
        }));
        setLoad(false);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };

  React.useEffect(() => {
    loading();
  }, []);

  return (
    <Paper sx={{ height: '100%' }} className="papier_attente">
      {load ? (
        <div className="loading">
          <Paper elevation={1} className="load_papier">
            <CircularProgress size={15} />
            <p>Loading...</p>
          </Paper>
        </div>
      ) : (
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="donut" // Spécifiez "donut" ici
          width={400} // Largeur personnalisée
          height={450} // Hauteur personnalisée
        />
      )}
    </Paper>
  );
}

export default Attente;
