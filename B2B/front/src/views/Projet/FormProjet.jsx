import { Edit, Save } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { Grid } from "@mui/system";
import axios from "axios";
import React from "react";
import { config, lien } from "src/static/Lien";
import DirectionSnackbar from "src/Static/SnackBar";
import { ContexteProjet } from "./Context";

function FormProjet({ dataedit }) {
  const { state, projetListe, setProjetListe } =
    React.useContext(ContexteProjet);

  const [initiale, setInitiale] = React.useState({
    description: "",
    designation: "",
    responsable: "",
    incharge: "",
    email: "",
    adresse: "",
    contact: "",
    nextstep: "",
    deedline: "",
  });
  const {
    description,
    deedline,
    incharge,
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
          incharge,
          adresse,
          deedline,
          email,
          responsable,
          idCategorie: state?.titre.id,
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
          incharge: "",
        });
        setSend({ label: false, message: "Projet enregistré" });
      } else {
        setSend({ label: false, message: "" + response.data });
      }
    } catch (error) {
      setSend({ label: false, message: "" + error.message });
    }
  };
  React.useEffect(() => {
    if (dataedit) {
      setInitiale({ ...dataedit, nextstep: dataedit.next_step });
    }
  }, [dataedit]);

  const EditProjet = async (event) => {
    event.preventDefault();
    setSend({ label: true, message: "" });
    try {
      const response = await axios.post(
        `${lien}/editprojet`,
        {
          id: dataedit._id,
          data: {
            designation,
            description,
            next_step: nextstep,
            contact,
            adresse,
            deedline,
            email,
            responsable,
            idCategorie: dataedit?.idCategorie,
            incharge,
          },
        },
        config
      );
      if (response.status === 200) {
        setProjetListe(
          projetListe.map((x) =>
            x.id === response.data.id ? response.data : x
          )
        );
        setSend({ label: false, message: "Modification effectuée" });
      } else {
        setSend({ label: false, message: response.data });
      }
    } catch (error) {
      setSend({ label: false, message: error.message });
    }
  };
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

          <TextField
            name="incharge"
            label="Personne en charge *"
            value={incharge}
            onChange={(event) => onchange(event)}
            variant="outlined"
            fullWidth
            sx={{
              mb: 1,
            }}
          />
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
            onClick={
              dataedit
                ? (event) => EditProjet(event)
                : (event) => sendData(event)
            }
            variant="contained"
            color={dataedit ? "warning" : "primary"}
            fullWidth
            disabled={send.label}
            sx={{ mt: 1 }}
          >
            {dataedit ? <Edit fontSize="small" /> : <Save fontSize="small" />}{" "}
            <span style={{ marginLeft: "10px" }}>
              {dataedit ? "Edit" : "Enregistrer"}
            </span>
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default FormProjet;
