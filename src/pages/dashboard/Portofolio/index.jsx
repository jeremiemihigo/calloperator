import { Grid } from "@mui/material";
import axios from "axios";
import NoCustomer from "components/Attente";
import LoaderGif from "components/LoaderGif";
import React from "react";
import { config, portofolio } from "static/Lien";
import Amount from "./Amount";
import Analyse from "./Analyse";

function Index() {
  const [data, setData] = React.useState();
  const [load, setLoad] = React.useState(false);
  const [message, setMesssage] = React.useState("");
  const loading = async () => {
    try {
      setLoad(true);
      const response = await axios.get(portofolio + "/actionAppel", config);
      if (response.status === 200) {
        setData(response.data);
        setLoad(false);
      } else {
        setMesssage(response.data);
        setLoad(false);
      }
    } catch (error) {
      setLoad(false);
      setMesssage(error.message);
    }
  };
  React.useEffect(() => {
    loading();
  }, []);

  return (
    <Grid container>
      <Grid
        item
        lg={10}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div>
          {load && <LoaderGif />}
          {data && !load && <Analyse data={data.analyse} />}
          {message && !load && <NoCustomer texte={message} />}
          <Amount />
        </div>
      </Grid>
    </Grid>
  );
}

export default Index;
