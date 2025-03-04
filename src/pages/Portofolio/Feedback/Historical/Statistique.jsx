import { Paper } from '@mui/material';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

function Statistique() {
  const [state] = React.useState({
    series: [200, 300, 20],
    options: {
      chart: {
        width: 300, // Augmentation de la largeur
        height: 300, // Ajout de la hauteur (optionnel)
        type: 'donut' // Assurez-vous que le type est "donut"
      },
      labels: ['Joignable', 'Injoignable', 'Rappeler'], // Labels initialisés à vide
      legend: {
        show: true,
        position: 'bottom',
        fontSize: '10px',
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

  return (
    <Paper sx={{ height: '100%', marginTop: '10px', padding: '10px' }}>
      <p style={{ fontSize: '13px' }}>Statistique d&apos;aujourd&apos;hui</p>
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="donut" // Spécifiez "donut" ici
        width={250} // Largeur personnalisée
        height={250} // Hauteur personnalisée
      />
    </Paper>
  );
}

export default Statistique;
