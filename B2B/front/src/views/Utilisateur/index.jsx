import { Fab } from "@mui/material";
import { IconAddressBook } from "@tabler/icons-react";
import React from "react";
import PageContainer from "src/components/container/PageContainer";
import DashboardCard from "src/components/shared/DashboardCard";
import Popup from "../../Static/Popup";
import FormUser from "./FormUser";
import TableUtilisateurs from "./Tableau";

function Utilisateur() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <PageContainer title="Utilisateurs" description="Utilisateurs">
        <DashboardCard
          title="Utilisateurs"
          action={
            <Fab onClick={() => setOpen(true)} size="small" color="primary">
              <IconAddressBook />
            </Fab>
          }
        >
          <TableUtilisateurs />
        </DashboardCard>
      </PageContainer>
      <Popup open={open} setOpen={setOpen} title="Formulaire">
        <FormUser />
      </Popup>
    </>
  );
}
export default Utilisateur;
