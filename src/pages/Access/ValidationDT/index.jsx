import { Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import ConfirmDialog from "Control/ControlDialog";
import _ from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { OtherUpdated } from "Redux/AgentAdmin";
import Popup from "static/Popup";
import Ajouter from "./Ajouter";

function Index() {
  const agent = useSelector((state) =>
    _.filter(state.agentAdmin?.agentAdmin, { validationdt: true, active: true })
  );
  const [confirmDialog, setConfirmDialog] = React.useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const handleDelete = (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });

    const data = {
      idAgent: id,
      data: { validationdt: false },
      unset: {},
    };
    dispatch(OtherUpdated(data));
  };
  return (
    <div>
      <Typography
        component="p"
        onClick={() => setOpen(true)}
        style={{
          color: "blue",
          padding: "0px",
          margin: "10px 0px",
          cursor: "pointer",
        }}
      >
        Ajoutez
      </Typography>
      {agent.map((item) => {
        return (
          <Chip
            sx={{ margin: "2px" }}
            key={item._id}
            label={item.nom}
            onDelete={() => {
              setConfirmDialog({
                isOpen: true,
                title: `Voulez-vous suppimer cette acces a l'agent ${item.nom}`,
                subTitle: "",
                onConfirm: () => {
                  handleDelete(item._id);
                },
              });
            }}
          />
        );
      })}
      <Popup
        open={open}
        setOpen={setOpen}
        title="Validation des cas sans demande d'arbitrage"
      >
        <Ajouter />
      </Popup>
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </div>
  );
}

export default React.memo(Index);
