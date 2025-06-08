import { Button } from "@mui/material";
import { Grid } from "@mui/system";
import React from "react";
import { useSelector } from "react-redux";
import DashboardCard from "src/components/shared/DashboardCard";
import Popup from "src/static/Popup";
import Selected from "src/static/Select";
import { allstatus } from "../../static/Lien";
import DirectionSnackbar from "../../static/SnackBar";
import FormProspect from "./AddProspect";
import ListeProspect from "./ListeProspect";

function index() {
  const prospect = useSelector((state) => state.prospect);
  const user = useSelector((state) => state.alluser.user);
  const [open, setOpen] = React.useState(false);
  const [statut, setStatut] = React.useState("all");

  const [filterFn, setFilterFn] = React.useState({
    fn: (items) => {
      return items;
    },
  });
  React.useEffect(() => {
    setFilterFn({
      fn: (items) => {
        if (statut === "all") {
          return items;
        } else {
          return items.filter((x) => x.statut === statut);
        }
      },
    });
  }, [statut]);

  if (user === "token_expired") {
    localStorage.removeItem("auth");
    window.location.replace("/auth/login");
  } else {
    return (
      <div>
        {prospect.delete === "rejected" && (
          <DirectionSnackbar message={prospect.deleteError} />
        )}
        {prospect.delete === "success" && <DirectionSnackbar message="Done" />}
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
                  data={[{ id: 6, title: "Tous", value: "all" }, ...allstatus]}
                  value={statut}
                  setValue={setStatut}
                />
              </Grid>
            </Grid>
          </>
        </DashboardCard>
        {prospect && prospect?.prospect.length > 0 && (
          <ListeProspect donner={filterFn.fn(prospect.prospect)} />
        )}
        <Popup open={open} setOpen={setOpen} title="Ajoutez un prospect">
          <FormProspect />
        </Popup>
      </div>
    );
  }
}
export default index;
