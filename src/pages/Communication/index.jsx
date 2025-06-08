import { MessageFilled } from "@ant-design/icons";
import { Grid, Paper, Typography } from "@mui/material";
import React from "react";
import Pa from "./Pa";
import Personnalise from "./Personnalise";
import Static from "./Static";
import "./structure.style.css";
import Technicien from "./Technicien";

function Communication() {
  const [select, setSelect] = React.useState(0);
  return (
    <Grid container>
      <Grid item lg={2}>
        <Paper
          className={select === 0 ? "select papier_" : "papier_"}
          onClick={() => setSelect(0)}
        >
          <MessageFilled size="small" />
          <Typography noWrap component="p">
            Message Static
          </Typography>
        </Paper>
        <Paper
          className={select === 1 ? "select papier_" : "papier_"}
          onClick={() => setSelect(1)}
        >
          <MessageFilled size="small" />
          <Typography noWrap component="p">
            Message Personnalisé
          </Typography>
        </Paper>
        <Paper
          className={select === 2 ? "select papier_" : "papier_"}
          onClick={() => setSelect(2)}
        >
          <MessageFilled size="small" />
          <Typography noWrap component="p">
            Performance PA
          </Typography>
        </Paper>
        <Paper
          className={select === 3 ? "select papier_" : "papier_"}
          onClick={() => setSelect(3)}
        >
          <MessageFilled size="small" />
          <Typography noWrap component="p">
            Performance technicien
          </Typography>
        </Paper>
      </Grid>
      <Grid item lg={10} sx={{ padding: "10px" }}>
        {select === 0 && <Static />}
        {select === 1 && <Personnalise />}
        {select === 2 && <Pa />}
        {select === 3 && <Technicien />}
      </Grid>
    </Grid>
  );
}

export default Communication;
