/* eslint-disable react/prop-types */
import moment from "moment";
import React from "react";
import "./chat.css";
// eslint-disable-next-line prettier/prettier

function Chat({ demandes }) {
  if (demandes && demandes.length > 0) {
    const index = demandes[demandes.length - 1];
    return (
      <div className="chats">
        <div className="co">
          <p>{index.message}</p>
          <p style={{ fontSize: "11px" }}>
            <span style={{ textAlign: "center" }}>{index.codeAgent}</span>
            <span style={{ float: "right" }}>
              {moment(index.createdAt).fromNow()}
            </span>
          </p>
        </div>
      </div>
    );
  }
}

export default React.memo(Chat);
