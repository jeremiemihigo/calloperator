import { Paper } from "@mui/material";
import Tabs from "Control/Tabs";
import Projet from "pages/Portofolio/Parametre/Projet";
import UploadFile from "pages/Portofolio/Parametre/Upload";
import Action from "./Action";

function Index() {
  const titres = [
    { id: 0, label: "Projet" },
    { id: 1, label: "Upload" },
    { id: 2, label: "Action" },
  ];
  const component = [
    { id: 0, component: <Projet /> },
    { id: 1, component: <UploadFile /> },
    { id: 2, component: <Action /> },
  ];
  return (
    <Paper>
      <Tabs titres={titres} components={component} />
    </Paper>
  );
}

export default Index;
