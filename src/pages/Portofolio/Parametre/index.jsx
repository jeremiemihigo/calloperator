import { Paper } from "@mui/material";
import Tabs from "Control/Tabs";
import UploadFile from "pages/Portofolio/Parametre/Upload";
import Payement from "./Payement";
import SavePayment from "./SavePayment";

function Index() {
  const titres = [
    { id: 0, label: "Upload" },
    { id: 1, label: "Payements" },
    { id: 2, label: "Save_payment" },
  ];
  const component = [
    { id: 0, component: <UploadFile /> },
    { id: 1, component: <Payement /> },
    { id: 2, component: <SavePayment /> },
  ];
  return (
    <Paper>
      <Tabs titres={titres} components={component} />
    </Paper>
  );
}

export default Index;
