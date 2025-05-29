import ConfirmDialog from "Control/ControlDialog";
import React from "react";
import "../style.css";
import BackOffice from "./BackOffice";
import ConfirmationCas from "./ConfirmationCas";
import PlainteCallCenter from "./PlainteCallCenter";
import PlainteShop from "./PlainteShop";
import Support from "./Support";
import SychroTeam from "./SynchroTeam";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";

export default function ControlledAccordions() {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const [confirmDialog, setConfirmDialog] = React.useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const table = [
    { id: "31660", title: "Support team (reponse)", composant: <Support /> },
    {
      id: "31661",
      title: "Enregistrement des plaintes (shop)",
      composant: <PlainteShop />,
    },
    {
      id: "31663",
      title: "Enregistrement des plaintes (call center)",
      composant: <PlainteCallCenter />,
    },
    { id: "31662", title: "Backoffice", composant: <BackOffice /> },
    { id: "31664", title: "Synchro team", composant: <SychroTeam /> },
    {
      id: "31665",
      title: "Confirmation des cas visites ménages",
      composant: <ConfirmationCas />,
    },
  ];
  return (
    <div>
      {table.map((index) => {
        return (
          <Accordion
            key={index.id}
            expanded={expanded === index.id}
            onChange={handleChange(index.id)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography
                component="span"
                sx={{ width: "100%", flexShrink: 0 }}
              >
                {index.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>{index.composant}</AccordionDetails>
          </Accordion>
        );
      })}

      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </div>
  );
}
