import { Grid } from "@mui/material";
import React from "react";
import "./chat.css";
import ContextDemande from "./ContextDemande";
import Liste from "./Liste";
import ReponseAdmin from "./Reponse";

function Demandes() {
  return (
    <ContextDemande>
      <Grid container>
        <Grid item xs={12} md={5} lg={4} sm={5}>
          <Liste />
        </Grid>
        <Grid item xs={12} md={7} lg={8} sm={7} sx={{ paddingLeft: "30px" }}>
          <ReponseAdmin />
        </Grid>
      </Grid>
    </ContextDemande>
  );
}
export default React.memo(Demandes);
