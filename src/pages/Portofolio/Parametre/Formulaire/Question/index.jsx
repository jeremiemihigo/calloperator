import { Grid } from "@mui/material";
import axios from "axios";
import React from "react";
import { useLocation } from "react-router-dom";
import { config, portofolio, puls_img } from "static/Lien";
import AffichageQuestion from "../AffichageQuestion";
import AddQuestion from "./AddQuestion";

function Index() {
  const { state } = useLocation();
  const [data, setData] = React.useState();
  const [loadingquestion, setLoadQuestion] = React.useState(false);
  const loading = async () => {
    try {
      setLoadQuestion(true);
      const response = await axios.get(
        `${portofolio}/readQuestionFormular/${state}`,
        config
      );
      if (response.status === 200) {
        setData(response.data);
        setLoadQuestion(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    if (state) {
      loading();
    }
  }, [state]);
  return (
    <div>
      {loadingquestion && <img src={puls_img} alt="chargement_image_pulse" />}
      <Grid container>
        <Grid item lg={5} sx={{ padding: "3px" }}>
          {state && <AddQuestion state={state} />}
        </Grid>
        <Grid item lg={7} sx={{ padding: "3px" }}>
          {data && !loadingquestion && data.length > 0 && (
            <AffichageQuestion data={data} />
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default Index;
