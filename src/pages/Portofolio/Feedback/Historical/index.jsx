import { Paper } from "@mui/material";
import React from "react";
import { ContextFeedback } from "../Context";
import Today from "./Today";
import "./style.css";

function Index() {
  const { client } = React.useContext(ContextFeedback);
  console.log(client);

  return (
    <div>
      {client && (
        <>
          <Paper className="historical">
            <p className="textes">Daily rate</p>
            <p className="nombres">${client.dailyrate} </p>
          </Paper>
          <Paper className="historical">
            <p className="textes">Weekly rate</p>
            <p className="nombres">${client.weeklyrate} </p>
          </Paper>
          <Paper className="historical">
            <p className="textes">Monthly rate</p>
            <p className="nombres">${client.monthlyrate} </p>
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
