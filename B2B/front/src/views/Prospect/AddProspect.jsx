import { Autocomplete, Button, TextField } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import DirectionSnackbar from "src/Static/SnackBar";
import { Addprospect } from "../../Redux/prospect";

function FormProspect({ projetSelect }) {
  const prospect = useSelector((state) => state.prospect);
  const alluser = useSelector((state) => state.alluser.user);
  const [suivi_par, setSuivipar] = React.useState([]);
  //designation, description, next_step
  const dispatch = useDispatch();
  const [initiale, setInitiale] = React.useState({
    description: "",
    designation: "",
    email: "",
    adresse: "",
    contact: "",
    nextstep: "",
    deedline: "",
  });
  const {
    description,
    contact,
    nextstep,
    deedline,
    adresse,
    email,
    designation,
  } = initiale;
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
          projet: projetSelect ? projetSelect : "",
          next_step: stepselect?.id,
          nextstep,
          deedline,
          contact,
          adresse,
          email,
          suivi_par: suivi_par.map((index) => {
            return index.name;
          }),
        })
      );
      setInitiale({ description: "", designation: "" });
      setStepSelect("");
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
      <TextField
        name="email"
        label="Email"
        type="email"
        value={email}
        onChange={(event) => onchange(event)}
        variant="outlined"
        fullWidth
        sx={{
          mb: 1,
        }}
      />
      <TextField
        name="contact"
        label="Contact"
        value={contact}
        onChange={(event) => onchange(event)}
        variant="outlined"
        fullWidth
        sx={{
          mb: 1,
        }}
      />
      <TextField
        name="adresse"
        label="Adresse"
        value={adresse}
        onChange={(event) => onchange(event)}
        variant="outlined"
        fullWidth
        multiline
        sx={{
          mb: 1,
        }}
      />
      {alluser && (
        <div style={{ margin: "10px 0px" }}>
          <Autocomplete
            multiple
            value={suivi_par}
            id="tags-outlined"
            onChange={(event, newValue) => {
              if (typeof newValue === "string") {
                setSuivipar({
                  title: newValue,
                });
              } else if (newValue && newValue.inputValue) {
                // Create a new value from the user input
                setSuivipar({
                  title: newValue.inputValue,
                });
              } else {
                setSuivipar(newValue);
              }
            }}
            options={alluser}
            getOptionLabel={(option) => option.name}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                label="Personne en charge au sein de Bboxx *"
                placeholder="Personne en charge au sein de Bboxx *"
              />
            )}
          />
        </div>
      )}
      <TextField
        name="nextstep"
        label="Next step"
        value={nextstep}
        onChange={(event) => onchange(event)}
        variant="outlined"
        fullWidth
        multiline
        sx={{
          mb: 1,
        }}
      />
      <TextField
        name="deedline"
        label="Deedline"
        value={deedline}
        onChange={(event) => onchange(event)}
        variant="outlined"
        fullWidth
        multiline
        sx={{
          mb: 1,
        }}
      />

      <Button
        onClick={(event) => sendData(event)}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 1 }}
      >
        Enregistrer
      </Button>
    </div>
  );
}

export default FormProspect;
