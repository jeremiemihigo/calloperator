import { Button, TextField } from "@mui/material";
import { Grid } from "@mui/system";
import axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import AutoComplement from "../../../static/AutoComplement";
import { config, lien } from "../../../static/Lien";
import DirectionSnackbar from "../../../Static/SnackBar";

function AddActionForm({ data, setData }) {
  //action, concerne, next_step, statut_actuel
  const steps = useSelector((state) =>
    state.steps.step.filter((x) => x.concerne === "projet")
  );
  const [stepSelect, setStepSelect] = React.useState("");
  const [action, setAction] = React.useState("");
  const [message, setMessage] = React.useState("");

  const sendData = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      const response = await axios.post(
        `${lien}/addaction`,
        {
          action,
          concerne: data?.id,
          next_step: stepSelect?.id,
          statut_actuel: data?.next_step,
        },
        config
      );
      if (response.status === 200) {
        setData(response.data);
        setStepSelect("");
        setAction("");
      }
    } catch (error) {
      setMessage("" + error.message);
    }
  };
  return (
    <Grid container>
      <Grid size={{ lg: 6 }}>
        {message && <DirectionSnackbar message={message} />}
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
      </Grid>
      <Grid size={{ lg: 6 }}>
        <Grid container>
          <Grid size={{ lg: 7 }}>
            <TextField
              name="depense"
              label="Ajoutez une dépense effectuée"
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
          </Grid>
          <Grid size={{ lg: 3 }}>
            <TextField
              name="cout"
              label="Coût"
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
          </Grid>
          <Grid size={{ lg: 2 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Confirmer
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default AddActionForm;
