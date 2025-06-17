import { Edit, Save } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { Grid } from "@mui/system";
import axios from "axios";
import React from "react";
import DirectionSnackbar from "src/Static/SnackBar";
import { config, lien } from "../../static/Lien";

function FormProspect({ projetSelect, loading, dataedit }) {
  //designation, description, next_step
  const [message, setMessage] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [initiale, setInitiale] = React.useState({
    description: "",
    designation: "",
    email: "",
    adresse: "",
    contact: "",
    nextstep: "",
    deedline: "",
    incharge: "",
  });
  const {
    description,
    contact,
    nextstep,
    deedline,
    adresse,
    email,
    designation,
    incharge,
  } = initiale;
  const onchange = (event) => {
    const { name, value } = event.target;
    setInitiale({
      ...initiale,
      [name]: value,
    });
  };
  const sendData = async (event) => {
    event.preventDefault();
    setPending(true);
    setMessage("");
    try {
      const response = await axios.post(
        `${lien}/addprospect`,
        {
          name: designation,
          description,
          projet: projetSelect ? projetSelect : "",
          next_step: nextstep,
          deedline,
          contact,
          adresse,
          email,
          incharge,
        },
        config
      );
      if (response.status === 200) {
        !projetSelect && loading();
        setPending(false);
        setMessage("Enregistrement effectuer");
        setInitiale({
          description: "",
          designation: "",
          email: "",
          adresse: "",
          contact: "",
          nextstep: "",
          deedline: "",
          incharge: "",
        });
      } else {
        setPending(false);
        setMessage(response.data);
      }
    } catch (error) {
      setPending(false);
      setMessage(error.message);
    }
  };
  React.useEffect(() => {
    if (dataedit) {
      setInitiale({
        ...dataedit,
        designation: dataedit?.name,
        nextstep: dataedit?.next_step,
      });
    }
  }, [dataedit]);
  const editprospect = async () => {
    try {
      setMessage("");
      setPending(true);
      const response = await axios.post(
        `${lien}/editprospect`,
        {
          id: dataedit?._id,
          data: {
            name: designation,
            description,
            next_step: nextstep,
            deedline,
            contact,
            adresse,
            email,
            incharge,
          },
        },
        config
      );
      if (response.status === 200) {
        loading();
        setPending(false);
        setMessage("Modification effectuée");
      } else {
        setMessage(response.data);
        setPending(false);
      }
    } catch (error) {
      setMessage(error.message);
      setPending(false);
    }
  };
  return (
    <div>
      {message && <DirectionSnackbar message={message} />}
      <Grid container>
        <Grid size={{ lg: 6 }} sx={{ padding: "4px" }}>
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
        </Grid>
        <Grid size={{ lg: 6 }} sx={{ padding: "4px" }}>
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
            multiline
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
            multiline
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
            fullWidth
            type="date"
            sx={{
              mb: 1,
            }}
          />
          <Button
            onClick={
              dataedit
                ? (event) => editprospect(event)
                : (event) => sendData(event)
            }
            variant="contained"
            disabled={pending}
            color={dataedit ? "warning" : "primary"}
            fullWidth
            sx={{ mt: 1 }}
          >
            {pending ? (
              "Please wait..."
            ) : (
              <>
                {dataedit ? (
                  <Edit fontSize="small" />
                ) : (
                  <Save fontSize="small" />
                )}
                <span style={{ marginLeft: "10px" }}>
                  {dataedit ? "Edit" : "Enregistrer"}
                </span>
              </>
            )}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default FormProspect;
