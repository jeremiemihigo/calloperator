import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Typography,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import AutoComplement from "Control/AutoComplet";
import ConfirmDialog from "Control/ControlDialog";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { OtherUpdated } from "Redux/AgentAdmin";
import Popup from "static/Popup";

function Support() {
  const agent = useSelector((state) => state.agentAdmin.agentAdmin);
  const [confirmDialog, setConfirmDialog] = React.useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [open, setOpen] = React.useState(false);
  const [agentSelect, setAgentSelect] = React.useState("");
  const dispatch = useDispatch();
  const handleDelete = async (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    dispatch(OtherUpdated({ unset: { taches: "" }, idAgent: id }));
  };
  const addone = () => {
    dispatch(
      OtherUpdated({
        data: { taches: "31660" },
        unset: {},
        idAgent: agentSelect._id,
      })
    );
    setAgentSelect("");
  };

  function AddTache() {
    return (
      <div style={{ width: "20rem" }}>
        <AutoComplement
          propr="nom"
          options={agent}
          setValue={setAgentSelect}
          value={agentSelect}
          title="Name"
        />
        <div style={{ marginTop: "10px" }}>
          <Button
            onClick={() => addone()}
            variant="contained"
            color="primary"
            fullWidth
          >
            Valider
          </Button>
        </div>
      </div>
    );
  }
  const [filterFn, setFilterFn] = React.useState({
    fn: (items) => {
      return items;
    },
  });
  const handleChanges = (e) => {
    let target = e.target.value.toUpperCase();
    setFilterFn({
      fn: (items) => {
        if (target === "") {
          return items;
        } else {
          return items.filter((x) => x.nom.includes(target.toUpperCase()));
        }
      },
    });
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
      <div style={{ margin: "10px 0px" }}>
        <FormControl sx={{ width: "100%" }}>
          <OutlinedInput
            size="small"
            id="header-search"
            startAdornment={
              <InputAdornment position="start" sx={{ mr: -0.5 }}>
                <SearchOutlined />
              </InputAdornment>
            }
            aria-describedby="header-search-text"
            inputProps={{
              "aria-label": "weight",
            }}
            onChange={(e) => handleChanges(e)}
            placeholder="Search..."
          />
        </FormControl>
      </div>
      {agent &&
        agent.length > 0 &&
        filterFn
          .fn(agent.filter((x) => x.taches && x.taches.length > 0))
          .map((item) => {
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

      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
      <Popup open={open} setOpen={setOpen} title="Add one">
        <AddTache />
      </Popup>
    </div>
  );
}

export default React.memo(Support);
