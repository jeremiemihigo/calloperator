import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { Paper } from "@mui/material";
import moment from "moment";
import React from "react";
import { CreateContextePerformance } from "./Context";

function MessageComponent() {
  const { result } = React.useContext(CreateContextePerformance);
  return (
    <div>
      {result &&
        result.length > 0 &&
        result.map((index) => {
          return (
            <div key={index._id}>
              <Paper elevation={2} className="elevation_name">
                <p className="concerne">{index.concerne}</p>
                <p className="message">{index.message}</p>
                <div className="footer">
                  <p className="moment">{moment(index.createdAt).fromNow()}</p>
                  {index.vu ? (
                    <DoneIcon fontSize="small" />
                  ) : (
                    <DoneAllIcon sx={{ color: "blue" }} fontSize="small" />
                  )}
                </div>
              </Paper>
            </div>
          );
        })}
    </div>
  );
}

export default MessageComponent;
