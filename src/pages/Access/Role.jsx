import { Grid } from "@mui/material";
import ConfirmDialog from "Control/ControlDialog";
import React from "react";
import "../style.css";
import BackOffice from "./BackOffice";
import ConfirmationCas from "./ConfirmationCas";
import PlainteCallCenter from "./PlainteCallCenter";
import PlainteShop from "./PlainteShop";
import Support from "./Support";
import SychroTeam from "./SynchroTeam";

function Role() {
  const [selected, setSelected] = React.useState("");

  const [confirmDialog, setConfirmDialog] = React.useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const table = [
    { id: "31660", title: "SUPPORT TEAM (reponse)" },
    { id: "31661", title: "ENREGISTREMENT DES PLAINTES (shop)" },
    { id: "31663", title: "ENREGISTREMENT DES PLAINTES (call center)" },
    { id: "31662", title: "BACK OFFICE (plainte)" },
    { id: "31664", title: "SYNCHRO TEAM" },
    { id: "31665", title: "CONFIRMATION DES CAS VISITES MENAGES" },
  ];
  return (
    <div>
      <Grid container>
        <Grid item lg={4}>
          <div style={{ marginTop: "10px" }}>
            {table.map((index) => {
              return (
                <Grid
                  sx={{ marginBottom: "10px" }}
                  key={index.id}
                  onClick={() => setSelected(index.id)}
                  className={selected === index.id ? "selected" : "notSelected"}
                >
                  <p style={{ padding: "0px", margin: "0px" }}>{index.title}</p>
                </Grid>
              );
            })}
          </div>
        </Grid>
        {selected === "31661" && (
          <Grid item lg={8}>
            <PlainteShop />
          </Grid>
        )}
        {selected === "31662" && (
          <Grid item lg={8}>
            <BackOffice />
          </Grid>
        )}
        {selected === "31663" && (
          <Grid item lg={8}>
            <PlainteCallCenter />
          </Grid>
        )}
        {selected === "31664" && (
          <Grid item lg={8}>
            <SychroTeam />
          </Grid>
        )}
        {selected === "31660" && (
          <Grid item lg={8}>
            <Support />
          </Grid>
        )}
        {selected === "31665" && (
          <Grid item lg={8}>
            <ConfirmationCas />
          </Grid>
        )}
      </Grid>
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </div>
  );
}

export default Role;
