import { Autocomplete, Button, TextField } from "@mui/material";
import axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import AutoComplement from "../../static/AutoComplement";
import { config, lien } from "../../static/Lien";
import DirectionSnackbar from "../../Static/SnackBar";
import { ContexteProjet } from "./Context";

function FormProjet() {
  const step = useSelector((state) =>
    state.steps.step.filter((x) => x.concerne === "projet")
  );
  const { state, projetListe, setProjetListe } =
    React.useContext(ContexteProjet);
  const [stepselect, setStepSelect] = React.useState("");
  const [suivi_par, setSuivipar] = React.useState([]);
  const alluser = useSelector((state) => state.alluser.user);
  //designation, description, next_step
  const [initiale, setInitiale] = React.useState({
    description: "",
    designation: "",
    responsable: "",
    email: "",
    adresse: "",
    contact: "",
  });
  const { description, contact, designation, adresse, email, responsable } =
    initiale;
  const onchange = (event) => {
    const { name, value } = event.target;
    setInitiale({
      ...initiale,
      [name]: value,
    });
  };
  const [send, setSend] = React.useState({ label: false, message: "" });

  const sendData = async (event) => {
    event.preventDefault();
    try {
      setSend({ label: true, message: "" });
      const response = await axios.post(
        `${lien}/addprojet`,
        {
          designation,
          description,
          next_step: stepselect?.id,
          contact,
          adresse,
          email,
          responsable,
          idCategorie: state?.titre.id,
          suivi_par: suivi_par.map((index) => {
            return index.name;
          }),
        },
        config
      );
      if (response.status === 200) {
        setProjetListe([response.data, ...projetListe]);
        setInitiale({
          description: "",
          designation: "",
          responsable: "",
          email: "",
          adresse: "",
          contact: "",
        });
        setSuivipar([]);
        setStepSelect("");
        setSend({ label: false, message: "Projet enregistré" });
      } else {
        setSend({ label: false, message: "" + response.data });
      }
    } catch (error) {
      setSend({ label: false, message: "" + error.message });
    }
  };
  // suivi_par,
  return (
    <div>
      {send.message && <DirectionSnackbar message={send.message} />}

      <TextField
        name="designation"
        onChange={(event) => onchange(event)}
        value={designation}
        label="Project name *"
        variant="outlined"
        fullWidth
        multiline
        sx={{
          mb: 1,
        }}
      />
      <TextField
        name="description"
        label="Description *"
        value={description}
        onChange={(event) => onchange(event)}
        variant="outlined"
        fullWidth
        multiline
        sx={{
          mb: 1,
        }}
      />
      <TextField
        name="responsable"
        label="Responsable *"
        value={responsable}
        onChange={(event) => onchange(event)}
        variant="outlined"
        fullWidth
        sx={{
          mb: 1,
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
      <AutoComplement
        value={stepselect}
        setValue={setStepSelect}
        options={step}
        title="Next step *"
        propr="title"
      />
      <Button
        onClick={(event) => sendData(event)}
        variant="contained"
        color="primary"
        fullWidth
        disabled={send.label}
        sx={{ mt: 1 }}
      >
        Enregistrer
      </Button>
    </div>
  );
}

export default FormProjet;
