import { Button } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import DashboardCard from "src/components/shared/DashboardCard";
import Popup from "src/static/Popup";
import AddProspect from "./AddProspect";
import ListeProspect from "./ListeProspect";

const Prospects = () => {
  const [openform, setOpenForm] = React.useState(false);
  const data = useSelector((state) => state.prospect.prospect);

  return (
    <>
      <DashboardCard
        title="Prospects"
        subtitle="Tous les prospects"
        action={
          <>
            <Button
              onClick={() => setOpenForm(true)}
              color="primary"
              variant="contained"
            >
              New Prospect
            </Button>
          </>
        }
      >
        {data && <ListeProspect donner={data} />}
      </DashboardCard>
      <Popup open={openform} setOpen={setOpenForm} title="Prospect">
        <AddProspect />
      </Popup>
    </>
  );
};

export default Prospects;
