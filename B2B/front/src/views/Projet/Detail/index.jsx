import { Button, Paper, Typography } from "@mui/material";
import { Grid } from "@mui/system";
import axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import DashboardCard from "src/components/shared/DashboardCard";
import { config, lien } from "src/static/Lien.js";
import Popup from "src/static/Popup.jsx";
import AddActionForm from "./AddAction.jsx";
import "./detail.style.css";
import Item from "./Item.jsx";
import Plus from "./Plus.jsx";

const DetailsProjet = () => {
  const location = useLocation();
  const prospect = useSelector((state) => state.prospect.prospect);
  const { state } = location;
  const navigation = useNavigate();
  const { id, type } = state;
  const [open, setOpen] = React.useState(false);

  const [data, setData] = React.useState();

  React.useEffect(() => {
    if (!id || !type) {
      navigation("/projets");
    }
  }, [state]);
  const loading = async () => {
    try {
      const response = await axios.post(
        `${lien}/readProjet`,
        { data: { id } },
        config
      );
      if (response.status === 200 && response.data.length > 0) {
        setData(response.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    if (type === "projet") {
      loading();
    }
    if (type === "prospect" && prospect) {
      setData(prospect.filter((x) => x.id === id)[0]);
    }
  }, [id, type, prospect]);
  const [show, setShow] = React.useState(false);
  console.log(data);

  const closeProcess = async (id) => {
    try {
      const response = await axios.post(`${lien}/closeaction`, { id }, config);
      if (response.status === 200) {
        setData(response.data);
      } else {
        alert(JSON.stringify(response.data));
      }
    } catch (error) {
      alert(JSON.stringify(error.message));
    }
  };

  return (
    <>
      <DashboardCard
        title={data && (data?.designation || data?.name)}
        subtitle={
          <Typography sx={{ cursor: "pointer" }} onClick={() => setShow(true)}>
            Cliquez ici pour plus des details
          </Typography>
        }
        action={
          <>
            <Button
              onClick={() => setOpen(true)}
              color="primary"
              variant="contained"
            >
              Add an action
            </Button>
          </>
        }
      ></DashboardCard>
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
            {data && data.actions && data.actions.length > 0 ? (
              <Item data={data.actions.reverse()} onclick={closeProcess} />
            ) : (
              <p
                style={{
                  color: "red",
                  textAlign: "center",
                  fontWeight: "bolder",
                }}
              >
                Aucune action trouvée
              </p>
            )}
          </Paper>
        </Grid>

        <Popup open={open} setOpen={setOpen} title="Save an action">
          <AddActionForm data={data} setData={setData} />
        </Popup>
        <Popup open={show} setOpen={setShow} title="Detail">
          <Plus data={data} />
        </Popup>
      </Grid>
    </>
  );
};

export default DetailsProjet;
