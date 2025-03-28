import { Paper } from "@mui/material";
import _ from "lodash";
import React from "react";
import ReactApexChart from "react-apexcharts";

function Statistique_Status({ data }) {
  const [state, setState] = React.useState();
  React.useEffect(() => {
    if (data) {
      let label = Object.keys(_.groupBy(data, "status"));
      setState({
        ...state,
        series: label.map((x) => {
          return _.filter(data, { status: x }).length;
        }),
        options: {
          chart: {
            width: 300, // Augmentation de la largeur
            height: 300, // Ajout de la hauteur (optionnel)
            type: "donut", // Assurez-vous que le type est "donut"
          },
          labels: label, // Labels initialisés à vide
          legend: {
            show: true,
            position: "bottom",
            fontSize: "10px",
            labels: {
              colors: ["#333"],
            },
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 300, // Taille réduite pour les petits écrans
                },
                legend: {
                  position: "bottom",
                },
              },
            },
          ],
        },
      });
    }
  }, [data]);

  return (
    <Paper
      sx={{
        height: "90%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        {state && (
          <ReactApexChart
            options={state.options}
            series={state.series}
            type="donut" // Spécifiez "donut" ici
            width={300} // Largeur personnalisée
            height={300} // Hauteur personnalisée
          />
        )}
      </div>
    </Paper>
  );
}

export default Statistique_Status;
