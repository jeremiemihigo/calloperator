import React from "react";
import { useSelector } from "react-redux";
import PageContainer from "src/components/container/PageContainer";
import Popup from "src/static/Popup";
import Acceuil from "./Acceuil";
import ContexteProjet from "./Context";
import FormProjet from "./FormProjet";

function Projets() {
  const [open, setOpen] = React.useState(false);
  const user = useSelector((state) => state.alluser.user);
  if (user === "token_expired") {
    localStorage.removeItem("auth");
    window.location.replace("/auth/login");
  } else {
    return (
      <>
        <PageContainer title="Projets" description="Projets B2B DRC">
          <ContexteProjet>
            <Acceuil />
            <Popup open={open} setOpen={setOpen} title="Nouveau Projet">
              <FormProjet />
            </Popup>
          </ContexteProjet>
        </PageContainer>
      </>
    );
  }
}
export default Projets;
