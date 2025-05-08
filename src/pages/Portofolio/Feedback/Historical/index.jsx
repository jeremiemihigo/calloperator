import { Paper } from "@mui/material";
import React from "react";
import { ContextFeedback } from "../Context";
import Today from "./Today";
import "./style.css";

function Index() {
  const { client } = React.useContext(ContextFeedback);

  return (
    <div>
      {client && (
        <>
          <Paper className="historical">
            <p className="textes">Daily rate</p>
            <p className="nombres">
              ${parseFloat(client.dailyrate).toFixed(1)}{" "}
            </p>
          </Paper>
          <Paper className="historical">
            <p className="textes">Weekly rate</p>
            <p className="nombres">
              {client.weeklyrate
                ? "$" + parseFloat(client.weeklyrate).toFixed(1)
                : "Search in puls"}
            </p>
          </Paper>
          <Paper className="historical">
            <p className="textes">Monthly rate</p>
            <p className="nombres">
              {client.monthlyrate
                ? "$" + parseFloat(client.monthlyrate).toFixed(1)
                : "Search in puls"}
            </p>
          </Paper>
          <Paper className="historical">
            <p className="textes">Total paid to date</p>
            <p className="nombres">
              {client.total_paid
                ? "$" + parseFloat(client.total_paid).toFixed(1)
                : "Search in puls"}
            </p>
          </Paper>
        </>
      )}

      <div className="statistique">
        <Today />
      </div>
    </div>
  );
}

export default Index;
