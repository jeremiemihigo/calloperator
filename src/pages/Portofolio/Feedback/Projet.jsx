// import AcceuilPage from './Acceuil';

import { Grid, Paper } from "@mui/material";
import NoCustomer from "components/Attente";
import React from "react";
import { useSelector } from "react-redux";
import AcceuilPage from "./Acceuil";
import { ContextFeedback } from "./Context";
import FullScreenDialog from "./PopupFullScreen";

function Projet() {
  const proj = useSelector((state) => state.projet.projet);
  const { setProjetSelect } = React.useContext(ContextFeedback);
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const functionOpen = (pro) => {
    setProjetSelect(pro.id);
    setTitle(pro.title);
    setOpen(true);
  };
  return (
    <div
      style={{
        backgroundColor: "#d9d9d9",
        borderRadius: "10px",
        padding: "10px",
      }}
    >
      <Grid container>
        {proj &&
          proj.map((index) => {
            return (
              <Grid
                onClick={() => functionOpen(index)}
                sx={{ padding: "5px", cursor: "pointer" }}
                item
                lg={3}
                key={index._id}
              >
                <Paper sx={{ padding: "20px", height: "100%" }}>
                  <p style={{ padding: "0px", margin: "0px" }}>{index.title}</p>
                </Paper>
              </Grid>
            );
          })}
        {proj && proj.length === 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <NoCustomer texte="No projects found" />
          </div>
        )}
      </Grid>
      <FullScreenDialog title={title} open={open} setOpen={setOpen}>
        <AcceuilPage />
      </FullScreenDialog>
      {/*  */}
    </div>
  );
}

export default Projet;
