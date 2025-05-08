import { Button, TextField } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Addprojet } from "../../Redux/projet";
import AutoComplement from "../../static/AutoComplement";
import DirectionSnackbar from "../../Static/SnackBar";

function FormProjet() {
  const step = useSelector((state) =>
    state.steps.step.filter((x) => x.concerne === "projet")
  );
  const projet = useSelector((state) => state.projet);
  const [stepselect, setStepSelect] = React.useState("");
  //designation, description, next_step
  const dispatch = useDispatch();
  const [initiale, setInitiale] = React.useState({
    description: "",
    designation: "",
  });
  const { description, designation } = initiale;
  const onchange = (event) => {
    const { name, value } = event.target;
    setInitiale({
      ...initiale,
      [name]: value,
    });
  };

  const sendData = (event) => {
    event.preventDefault();
    try {
      dispatch(
        Addprojet({
          designation,
          description,
          next_step: stepselect?.id,
        })
      );
      setInitiale({ description: "", designation: "" });
      setStepSelect("");
    } catch (error) {}
  };
  return (
    <div>
      {projet.saveprojet === "success" && <DirectionSnackbar message="Done" />}
      {projet.saveprojet === "rejected" && (
        <DirectionSnackbar message={projet.saveprojetError} />
      )}
      <TextField
        name="designation"
        onChange={(event) => onchange(event)}
        value={designation}
        label="Project name"
        variant="outlined"
        fullWidth
        multiline
        sx={{
          mb: 2,
          mt: 1,
        }}
      />
      <TextField
        name="description"
        label="Description"
        value={description}
        onChange={(event) => onchange(event)}
        variant="outlined"
        fullWidth
        multiline
        sx={{
          mb: 2,
        }}
      />
      <AutoComplement
        value={stepselect}
        setValue={setStepSelect}
        options={step}
        title="Next step"
        propr="title"
      />
      <Button
        onClick={(event) => sendData(event)}
        variant="contained"
        color="primary"
        fullWidth
        disabled={projet.saveprojet === "pending"}
        sx={{ mt: 1 }}
      >
        Enregistrer
      </Button>
    </div>
  );
}

export default FormProjet;
