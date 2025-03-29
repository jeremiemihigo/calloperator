import { Checkbox, Grid, Paper } from "@mui/material";
import moment from "moment";
import React from "react";
import { ContextFeedback } from "../Context";
import Injoignable from "./Injoignable";
import Joignable from "./Joignable";
import Rappeler from "./Rappeler";

function Call() {
  const { checked, setChecked, client } = React.useContext(ContextFeedback);

  return (
    <div className="feedback_liste">
      {client && client.feedback.length > 0 && (
        <Paper
          sx={{
            padding: "10px",
            alignItems: "center",
            gap: "30px",
            display: "flex",
            marginBottom: "4px",
          }}
        >
          <p
            style={{
              padding: "0px",
              margin: "0px",
              fontSize: "20px",
              fontWeight: "bolder",
            }}
          >
            {client.feedback[client.feedback.length - 1].sioui_texte}
          </p>
          <p
            style={{
              padding: "0px",
              margin: "0px",
              fontSize: "13px",
            }}
          >
            Et vous comptez vous réactiver quand?
            <span style={{ fontWeight: "bolder" }}>
              {" " +
                moment(
                  client.feedback[client.feedback.length - 1].sioui_date
                ).format("dddd DD MM YYYY")}
            </span>
          </p>
        </Paper>
      )}
      <Paper className="call_option" sx={{ marginBottom: "5px" }}>
        <Grid
          className="call_option_item"
          onClick={() => setChecked("joignable")}
        >
          <Checkbox checked={checked === "joignable"} />
          <p>Reachable</p>
        </Grid>
        <Grid
          className="call_option_item"
          onClick={() => setChecked("injoignable")}
        >
          <Checkbox checked={checked === "injoignable"} />
          <p>Unreachable</p>
        </Grid>
        <Grid
          className="call_option_item"
          onClick={() => setChecked("rappeler")}
        >
          <Checkbox checked={checked === "rappeler"} />
          <p>Remind</p>
        </Grid>
      </Paper>
      {checked === "joignable" && <Joignable />}
      {checked === "injoignable" && <Injoignable />}
      {checked === "rappeler" && <Rappeler />}
    </div>
  );
}

export default Call;
