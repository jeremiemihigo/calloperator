import { Button } from "@mui/material";
import { Grid } from "@mui/system";
import axios from "axios";
import React from "react";
import DashboardCard from "src/components/shared/DashboardCard";
import { allstatus } from "src/static/Lien";
import Popup from "src/static/Popup";
import Selected from "src/static/Select";
import { config, lien } from "../../static/Lien";
import FormProspect from "./AddProspect";
import ListeProspect from "./ListeProspect";

function index() {
  const [open, setOpen] = React.useState(false);
  const [statut, setStatut] = React.useState("En cours");
  const [data, setData] = React.useState();
  const [load, setLoad] = React.useState(false);

  const loading = async () => {
    try {
      setLoad(true);
      const response = await axios.post(
        `${lien}/deadProspectBy`,
        { data: { statut } },
        config
      );
      if (response.status === 201 && response.data === "token_expired") {
        localStorage.removeItem("auth");
        window.location.replace("/auth/login");
      }
      if (response.status === 200) {
        setData(response.data);
        setLoad(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loading();
  }, [statut]);

  return (
    <div>
      <DashboardCard
        title="Prospect"
        subtitle="Tous les prospects"
        action={
          <>
            <Button
              onClick={() => setOpen(true)}
              color="primary"
              variant="contained"
            >
              Nouveau prospect
            </Button>
          </>
        }
      >
        <>
          <Grid container>
            <Grid
              item
              size={{ lg: 4 }}
              style={{ padding: "3px", width: "15%" }}
              className="display_"
            >
              <Selected
                label="Statut"
                data={allstatus}
                value={statut}
                setValue={setStatut}
              />
            </Grid>
          </Grid>
        </>
      </DashboardCard>
      {load && <p style={{ textAlign: "center" }}>Loading...</p>}
      {data && data.length > 0 && <ListeProspect donner={data} />}
      <Popup open={open} setOpen={setOpen} title="Ajoutez un prospect">
        <FormProspect loading={loading} />
      </Popup>
    </div>
  );
}
export default index;
