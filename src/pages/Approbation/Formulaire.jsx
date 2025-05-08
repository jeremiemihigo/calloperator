import { Button, Grid } from "@mui/material";
import { Input } from "antd";
import axios from "axios";
import React from "react";
import { config, lien } from "static/Lien";
const { TextArea } = Input;

function Formulaire({ setData, data, onselect }) {
  const [feedback, setFeedback] = React.useState("");
  const Approved = async (statut) => {
    try {
      const response = await axios.post(
        lien + "/approvedbyRs",
        {
          id: onselect._id,
          feedbackrs: feedback,
          concerne: statut === "approved" ? "rs" : "agent",
          feedback: statut === "approved" ? "new" : "chat",
        },
        config
      );
      if (response.status === 200) {
        setData(data.filter((x) => x._id !== onselect._id));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div style={{ width: "20rem" }}>
      <div style={{ marginBottom: "10px" }}>
        <TextArea
          required
          value={feedback}
          onChange={(e) => {
            setFeedback(e.target.value);
          }}
          placeholder="Reason why you reject the visit"
          autoSize={{
            minRows: 3,
            maxRows: 5,
          }}
        />
      </div>
      <Grid container>
        <Grid item lg={6} sx={{ padding: "2px" }}>
          <Button
            onClick={() => Approved("approved")}
            fullWidth
            color="primary"
            variant="contained"
          >
            Approved
          </Button>
        </Grid>
        <Grid item lg={6} sx={{ padding: "2px" }}>
          <Button
            onClick={() => Approved("rejected")}
            fullWidth
            color="warning"
            variant="contained"
          >
            Not Approved
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default Formulaire;
