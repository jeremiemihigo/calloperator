import { Autocomplete, Button, TextField } from "@mui/material";
import { Grid } from "@mui/system";
import axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import { config, lien } from "../../static/Lien";
import DirectionSnackbar from "../../Static/SnackBar";
import { ContexteProjet } from "./Context";

function FormProjet() {
  const { state, projetListe, setProjetListe } =
    React.useContext(ContexteProjet);
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
    nextstep: "",
    deedline: "",
  });
  const {
    description,
    deedline,
    contact,
    nextstep,
    designation,
    adresse,
    email,
    responsable,
  } = initiale;
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
          next_step: nextstep,
          contact,
          adresse,
          deedline,
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
          nextstep: "",
        });
        setSuivipar([]);
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
      <Grid container>
        <Grid size={{ lg: 6 }} sx={{ padding: "5px" }}>
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
        </Grid>
        <Grid size={{ lg: 6 }} sx={{ padding: "5px" }}>
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
            label="Next step *"
            value={nextstep}
            onChange={(event) => onchange(event)}
            variant="outlined"
            fullWidth
            sx={{
              mb: 1,
            }}
          />
          <TextField
            name="deedline"
            label="Deedline *"
            value={deedline}
            onChange={(event) => onchange(event)}
            variant="outlined"
            type="date"
            fullWidth
            sx={{
              mb: 1,
            }}
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
        </Grid>
      </Grid>
    </div>
  );
}

export default FormProjet;
