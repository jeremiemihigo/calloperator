import { Add } from "@mui/icons-material";
import { Fab, Paper } from "@mui/material";
import React from "react";
import Popup from "static/Popup";
import Formulaire from "./Formulaire";
import Table from "./Table";

function Feedback() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Fab size="small" color="primary" onClick={() => setOpen(true)}>
        <Add fontSize="small" />
      </Fab>
      <Paper elevation={2} sx={{ padding: "10px" }}>
        <Table />
      </Paper>

      <Popup open={open} setOpen={setOpen} title="Formulaire">
        <Formulaire />
      </Popup>
    </>
  );
}

export default Feedback;
