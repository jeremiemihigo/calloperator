import { GraphicEq, House } from "@mui/icons-material";
import { Grid, Paper } from "@mui/material";
import { Skeleton } from "@mui/material/index";
import axios from "axios";
import React from "react";
import { big_data, config } from "static/Lien";
import Analyse from "./Analyse";
import Portofolio from "./Portofolio";
import DashboardDefault from "./Visite";

function Dashboard() {
  const [select, setSelect] = React.useState(0);
  const [attente, setAttente] = React.useState();
  const loadings = async () => {
    try {
      const response = await axios.get(
        `${big_data}/toutesDemandeAttente/1500`,
        config
      );
      if (response.status === 201 && response.data === "token expired") {
        localStorage.removeItem("auth");
        window.location.replace("/login");
      }
      if (response.status === 200) {
        setAttente(response.data.length);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    loadings();
  }, []);
  return (
    <>
      <Grid container>
        <Grid item lg={2} sx={{ padding: "10px" }}>
          <Paper elevation={2} sx={{ backgroundColo: "rgb(0,169,254)" }}>
            {attente ? (
              <p
                style={{
                  padding: "10px",
                  fontSize: "12px",
                }}
              >
                {attente > 1
                  ? `${attente} visites sont en attente`
                  : `${attente} visite est en attente`}
              </p>
            ) : (
              <Skeleton type="text" />
            )}
          </Paper>

          <Paper
            onClick={() => setSelect(0)}
            sx={select === 0 ? style.papierselect : style.papier}
          >
            <div style={style.flex}>
              <House />
            </div>

            <p style={style.texte}>Visite Menage</p>
          </Paper>
          <Paper
            onClick={() => setSelect(1)}
            sx={select === 1 ? style.papierselect : style.papier}
          >
            <div style={style.flex}>
              <GraphicEq />
            </div>
            <p style={style.texte}>Analyse VM</p>
          </Paper>
          <Paper
            onClick={() => setSelect(2)}
            sx={select === 2 ? style.papierselect : style.papier}
          >
            <div style={style.flex}>
              <GraphicEq />
            </div>
            <p style={style.texte}>Portofolio</p>
          </Paper>
        </Grid>
        <Grid item lg={10}>
          {select === 0 && <DashboardDefault />}
          {select === 1 && <Analyse />}
          {select === 2 && <Portofolio />}
        </Grid>
      </Grid>
    </>
  );
}
const style = {
  texte: {
    margin: "0px",
    padding: "0px",
    textAlign: "center",
    fontSize: "12px",
    marginTop: "10px",
  },
  flex: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  papier: {
    padding: "5px",
    cursor: "pointer",
    marginBottom: "10px",
  },
  papierselect: {
    backgroundColor: "rgb(0,169,254)",
    color: "white",
    padding: "5px",
    cursor: "pointer",
    marginBottom: "10px",
  },
};
export default Dashboard;
