import { Grid, Typography } from "@mui/material";
import React from "react";
import Popup from "static/Popup";
import AddPoste from "./AddPoste";

function ShowPoste({ posteselect }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Grid className="ajouter" onClick={() => setOpen(true)}>
        <Typography noWrap component="p">
          Add_post
        </Typography>
      </Grid>
      <Popup open={open} setOpen={setOpen} title="Add post">
        <AddPoste posteselect={posteselect} />
      </Popup>
    </>
  );
}

export default ShowPoste;
