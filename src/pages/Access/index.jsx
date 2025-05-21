import { Paper } from "@mui/material";
import Tabs from "Control/Tabs";
import Role from "pages/Access/Role";
import Plainte from "pages/Issue/Plainte";
import Departement from "./Departement";
import Feedback from "./Feedback";
import AgentListeAdmin from "./Liste";

function Index() {
  const titres = [
    { id: 0, label: "Count" },
    // { id: 1, label: 'Ticket shop' },
    { id: 1, label: "Role Service client" },
    { id: 2, label: "Departement" },
    { id: 3, label: "Feedback" },
    { id: 4, label: "Complaint" },
  ];
  const component = [
    { id: 0, component: <AgentListeAdmin /> },
    { id: 1, component: <Role /> },
    { id: 2, component: <Departement /> },
    { id: 3, component: <Feedback /> },
    { id: 4, component: <Plainte /> },
  ];
  return (
    <Paper>
      <Tabs titres={titres} components={component} />
    </Paper>
  );
}

export default Index;
