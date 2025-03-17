import { Search } from "@mui/icons-material";
import { Button, CircularProgress, Grid, Paper } from "@mui/material";
import { Input } from "antd";
import AutoComplement from "Control/AutoComplet";
import React from "react";
import { useSelector } from "react-redux";
import ExcelButton from "static/ExcelButton";
import { config, portofolio } from "static/Lien";
import axios from "../../../../node_modules/axios/index";
import { generateNomFile } from "../NameFile";
import Agents from "./Agents";

function Rapport() {
  const [dates, setDates] = React.useState({ debut: "", fin: "" });
  const { debut, fin } = dates;
  const projet = useSelector((state) => state.projet.projet);
  const [projetSelect, setProjetSelect] = React.useState("");

  const [samplejson2, setsampleJson] = React.useState();
  const [nomFile, setNomFile] = React.useState("");

  const [loading, setLoading] = React.useState(false);

  const searchData = async () => {
    try {
      setLoading(true);
      setNomFile(generateNomFile(dates, projetSelect?.title));
      const response = await axios.post(
        portofolio + "/rapportportofolio",
        {
          debut,
          fin,
          idFormulaire: projetSelect?.idFormulaire,
          idProjet: projetSelect?.id,
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
            <Grid item lg={4} sm={4} xs={6} md={3} sx={{ padding: "5px" }}>
              {projet && projet.length > 0 && (
                <AutoComplement
                  value={projetSelect}
                  setValue={setProjetSelect}
                  options={projet}
                  title="Select a project"
                  propr="title"
                />
              )}
            </Grid>
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
          <Grid item lg={6} sx={{ padding: "2px" }}>
            <Paper elevation={2}>
              <Agents data={samplejson2} />
            </Paper>
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default Rapport;
