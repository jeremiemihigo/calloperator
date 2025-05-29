import { Button, TextField } from "@mui/material";
import { Grid } from "@mui/system";
import axios from "axios";
import _ from "lodash";
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
  const [cout, setCout] = React.useState({
    depense: "",
    cout: "",
  });
  const [allcout, setAllcout] = React.useState([]);

  const onchangecout = (event) => {
    try {
      const { name, value } = event.target;
      setCout({ ...cout, [name]: value });
    } catch (error) {
      console.log(error);
    }
  };

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
          cout: allcout,
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
              value={cout.depense}
              variant="outlined"
              onChange={(event) => onchangecout(event)}
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
              value={cout.cout}
              variant="outlined"
              onChange={(event) => onchangecout(event)}
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
              onClick={() => {
                setAllcout([...allcout, { id: allcout.length + 1, ...cout }]);
                setCout({ depense: "", cout: "" });
              }}
              fullWidth
              sx={{ mt: 2 }}
            >
              Confirmer
            </Button>
          </Grid>
        </Grid>
        <div className="tableau_detail">
          <table>
            <thead>
              <tr>
                <td>#</td>
                <td>Dépense</td>
                <td>Coût</td>
                <td>Option</td>
              </tr>
            </thead>
            <tbody>
              {allcout.map((index, key) => {
                return (
                  <tr key={key}>
                    <td>{index.id}</td>
                    <td>{index.depense}</td>
                    <td>{index.cout}</td>
                    <td
                      className="delete"
                      onClick={() =>
                        setAllcout(allcout.filter((x) => x.id !== index.id))
                      }
                    >
                      Delete
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan="2">Total</td>
                <td colSpan="2">
                  {_.reduce(
                    allcout,
                    function (next, curr) {
                      return next + parseFloat(curr.cout);
                    },
                    0
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Grid>
    </Grid>
  );
}

export default AddActionForm;
