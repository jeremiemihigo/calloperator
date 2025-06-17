import { Search } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { Input } from "antd";
import axios from "axios";
import React from "react";
import ExcelButton from "static/ExcelButton";
import { config, portofolio } from "static/Lien";
import { generateNomFile } from "../NameFile";
import Agents from "./Agents";
import Statistique_Status from "./Stat_status";
import Static_Feedback from "./Static_Feedback";
import TabAgent from "./TabAgent";

function Rapport() {
  const [dates, setDates] = React.useState({ debut: "", fin: "" });
  const { debut, fin } = dates;

  const [samplejson2, setsampleJson] = React.useState();
  const [nomFile, setNomFile] = React.useState("");

  const [loading, setLoading] = React.useState(false);

  const searchData = async () => {
    try {
      setLoading(true);
      setNomFile(generateNomFile(dates, "Appels portefeuille "));
      const response = await axios.post(
        portofolio + "/rapportportofolio",
        {
          debut,
          fin,
        },
        config
      );
      if (response.status === 200) {
        setsampleJson(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Paper sx={{ padding: "5px" }} elevation={3}>
        <div>
          <Grid container>
            <Grid item lg={2} sm={4} xs={6} md={3} sx={{ padding: "5px" }}>
              <Input
                type="date"
                onChange={(e) =>
                  setDates({
                    ...dates,
                    debut: e.target.value,
                  })
                }
                placeholder="Date"
              />
            </Grid>
            <Grid item lg={2} sm={4} xs={6} md={3} sx={{ padding: "5px" }}>
              <Input
                onChange={(e) =>
                  setDates({
                    ...dates,
                    fin: e.target.value,
                  })
                }
                type="date"
                placeholder="Date"
              />
            </Grid>
            <Grid item lg={2} sm={2} xs={6} md={3} sx={{ padding: "5px" }}>
              <Button
                disabled={loading}
                fullWidth
                color="primary"
                variant="contained"
                onClick={() => searchData()}
              >
                {loading ? (
                  <CircularProgress size={12} />
                ) : (
                  <Search fontSize="small" />
                )}
              </Button>
            </Grid>
            {!loading && samplejson2 && (
              <Grid item lg={2} sm={2} md={3} xs={6} sx={{ padding: "5px" }}>
                <ExcelButton
                  data={samplejson2}
                  title={`${samplejson2.length} calls`}
                  fileName={`${nomFile}.xlsx`}
                />
              </Grid>
            )}
          </Grid>
        </div>
      </Paper>
      {samplejson2 && samplejson2.length > 0 && (
        <Grid container sx={{ marginTop: "10px" }}>
          <Grid item lg={6} xs={12} md={6} sx={{ padding: "2px" }}>
            <Paper sx={{ padding: "5px", margin: "5px" }}>All calls made</Paper>
            <Agents data={samplejson2} />
          </Grid>
          <Grid item lg={6} xs={12} md={6} sx={{ padding: "2px" }}>
            <Paper sx={{ padding: "5px", margin: "5px" }}>
              Status of calls from contacted customers
            </Paper>
            <Statistique_Status data={samplejson2} />
          </Grid>
          <Grid item lg={7} xs={12} md={6} sx={{ padding: "2px" }}>
            <Paper sx={{ padding: "5px", margin: "5px" }}>
              <Typography noWrap>Raison du non-paiement.</Typography>
            </Paper>
            <Static_Feedback data={samplejson2} />
          </Grid>
          <Grid item lg={5} xs={12} md={6} sx={{ padding: "2px" }}>
            <Paper sx={{ padding: "5px", margin: "5px" }}>Agent</Paper>
            <TabAgent data={samplejson2} />
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default Rapport;
