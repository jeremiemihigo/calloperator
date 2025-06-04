import { Paper } from "@mui/material";
import { Grid } from "@mui/system";
import axios from "axios";
import { useSelector } from "react-redux";
import DashboardCard from "src/components/shared/DashboardCard";
import { config, lien } from "src/static/Lien.js";
import Item from "../Detail/Item";

const ActionEnCours = () => {
  const data = useSelector((state) => state.action.action);
  const closeProcess = async (id) => {
    try {
      const response = await axios.post(`${lien}/closeaction`, { id }, config);
      if (response.status === 200) {
        window.location.replace("/action_en_cours");
      } else {
        alert(JSON.stringify(response.data));
      }
    } catch (error) {
      alert(JSON.stringify(error.message));
    }
  };

  return (
    <>
      <DashboardCard title="Toutes les actions en cours"></DashboardCard>
      <Grid container>
        <Grid size={{ lg: 12 }}>
          <Paper
            elevation={2}
            sx={{
              overflow: "auto",
              marginTop: "10px",
              width: { xs: "280px", sm: "auto" },
            }}
          >
            {data && data.length > 0 ? (
              <Item data={data} onclick={closeProcess} />
            ) : (
              <p
                style={{
                  color: "red",
                  textAlign: "center",
                  fontWeight: "bolder",
                }}
              >
                Aucune action en cours
              </p>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default ActionEnCours;
