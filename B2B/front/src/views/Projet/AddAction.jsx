import { Button, TextField } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddAction } from "../../Redux/projet";
import AutoComplement from "../../static/AutoComplement";
import DirectionSnackbar from "../../Static/SnackBar";

function AddActionForm({ projetSelect }) {
  //action, concerne, next_step, statut_actuel
  const steps = useSelector((state) =>
    state.steps.step.filter((x) => x.concerne === "projet")
  );
  const [stepSelect, setStepSelect] = React.useState("");
  const [action, setAction] = React.useState("");
  const [message, setMessage] = React.useState("");
  const projet = useSelector((state) => state.projet);

  const dispatch = useDispatch();
  const sendData = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      dispatch(
        AddAction({
          action,
          concerne: projetSelect?.id,
          next_step: stepSelect?.id,
          statut_actuel: projetSelect?.next_step,
        })
      );

      setStepSelect("");
      setAction("");
    } catch (error) {
      setMessage("" + error.message);
    }
  };
  return (
    <div>
      {message && <DirectionSnackbar message={message} />}
      {projet.addaction === "success" && <DirectionSnackbar message="Done" />}
      {projet.addaction === "rejected" && (
        <DirectionSnackbar message={projet.addactionError} />
      )}
      <TextField
        name="Action"
        label="Action"
        variant="outlined"
        value={action}
        onChange={(event) => setAction(event.target.value)}
        fullWidth
        multiline
        sx={{
          mt: 2,
          mb: 2,
          minWidth: "20rem",
        }}
      />
      <AutoComplement
        value={stepSelect}
        setValue={setStepSelect}
        options={steps}
        title="Etape suivante"
        propr="title"
      />
      <Button
        onClick={(event) => sendData(event)}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Valider
      </Button>
    </div>
  );
}

export default AddActionForm;
