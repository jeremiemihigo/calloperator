// import AcceuilPage from './Acceuil';

import { Paper } from "@mui/material";
import React from "react";
import AcceuilPage from "./Acceuil";
import FullScreenDialog from "./PopupFullScreen";

function Projet() {
  const [open, setOpen] = React.useState(true);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          justifyContent: "center",
        }}
      >
        <Paper
          sx={{
            padding: "20px",
            cursor: "pointer",
            color: "white",
            fontWeight: "bolder",
            backgroundColor: "rgb(0,169,254)",
          }}
          onClick={() => setOpen(true)}
        >
          <p>Make a call</p>
        </Paper>
      </div>
      <FullScreenDialog open={open} setOpen={setOpen}>
        <AcceuilPage />
      </FullScreenDialog>
    </>
  );
}

export default Projet;
