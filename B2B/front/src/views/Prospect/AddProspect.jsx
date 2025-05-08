import { Button, TextField } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import AutoComplement from "src/static/AutoComplement";
import DirectionSnackbar from "src/Static/SnackBar";
import { Addprospect } from "../../Redux/prospect";

function FormProspect() {
  const step = useSelector((state) =>
    state.steps.step.filter((x) => x.concerne === "prospect")
  );
  const projet = useSelector((state) => state.projet.projet);
  const prospect = useSelector((state) => state.prospect);
  const [projetSelect, setProjetSelect] = React.useState("");
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
        Addprospect({
          name: designation,
          description,
          projet: projetSelect ? projetSelect?.id : "",
          next_step: stepselect?.id,
        })
      );
      setInitiale({ description: "", designation: "" });
      setStepSelect("");
      setProjetSelect("");
    } catch (error) {}
  };
  return (
    <div>
      {prospect.saveprospect === "success" && (
        <DirectionSnackbar message="Done" />
      )}
      {prospect.saveprospect === "rejected" && (
        <DirectionSnackbar message={prospect.saveprospectError} />
      )}
      <TextField
        name="designation"
        onChange={(event) => onchange(event)}
        value={designation}
        label="Name"
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
      <div style={{ marginBottom: "15px" }}>
        <AutoComplement
          value={projetSelect}
          setValue={setProjetSelect}
          options={projet}
          title="Projet"
          propr="designation"
        />
      </div>
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

export default FormProspect;
