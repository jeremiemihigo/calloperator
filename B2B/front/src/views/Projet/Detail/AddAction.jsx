import { Save } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { Grid } from "@mui/system";
import axios from "axios";
import _ from "lodash";
import React from "react";
import { config, lien } from "src/static/Lien";
import DirectionSnackbar from "src/Static/SnackBar";
import "./add.style.css";

function AddActionForm({ data, setData }) {
  //action, concerne, next_step, statut_actuel
  const [files, setFiles] = React.useState();

  const [initiale, setInitiale] = React.useState({
    commentaire: "",
    stepSelect: "",
    deedline: "",
  });
  const { commentaire, stepSelect, deedline } = initiale;
  const onchange = (event) => {
    const { name, value } = event.target;
    setInitiale({
      ...initiale,
      [name]: value,
    });
  };

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
  console.log(files);

  const [action, setAction] = React.useState("");
  const [message, setMessage] = React.useState("");

  const sendData = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("action", action);
      formData.append("concerne", data?.id);
      formData.append("next_step", stepSelect);
      formData.append("statut_actuel", data?.next_step);
      if (allcout && allcout.length > 0) {
        formData.append("cout", JSON.stringify(allcout)); // Même champ pour chaque fichier
      }
      formData.append("deedline", deedline);
      formData.append("commentaire", commentaire);
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          formData.append("files", files[i]); // Même champ pour chaque fichier
        }
      }
      if (files && files.length > 0) {
        const response = await axios.post(
          `${lien}/addaction`,
          formData,
          config
        );
        if (response.status === 200) {
          setData(response.data);
          setInitiale({
            commentaire: "",
            stepSelect: "",
            deedline: "",
          });
        }
      } else {
        const response = await axios.post(
          `${lien}/addaction_sans_fichier`,
          {
            action,
            concerne: data?.id,
            next_step: stepSelect,
            statut_actuel: data?.next_step,
            cout: JSON.stringify(allcout),
            deedline,
            commentaire,
          },
          config
        );
        if (response.status === 200) {
          setData(response.data);
          setInitiale({
            commentaire: "",
            stepSelect: "",
            deedline: "",
          });
        }
      }
    } catch (error) {
      setMessage("" + error.message);
    }
  };
  return (
    <Grid container>
      <Grid size={{ lg: 12 }}>
        <Grid container>
          <Grid size={{ lg: 12 }}>
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
          <Grid size={{ lg: 8 }}>
            <TextField
              name="cout"
              label="Coût"
              value={cout.cout}
              variant="outlined"
              onChange={(event) => onchangecout(event)}
              fullWidth
              multiline
            />
          </Grid>
          <Grid
            size={{ lg: 4 }}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setAllcout([...allcout, { id: allcout.length + 1, ...cout }]);
                setCout({ depense: "", cout: "" });
              }}
              fullWidth
            >
              Confirmer
            </Button>
          </Grid>
        </Grid>
        {allcout.length > 0 && (
          <div className="tableau_detail">
            <table>
              <thead>
                <tr>
                  <td style={{ width: "10%" }}>#</td>
                  <td style={{ width: "40%" }}>Dépense</td>
                  <td style={{ width: "25%" }}>Amount $</td>
                  <td style={{ width: "25%" }}>Option</td>
                </tr>
              </thead>
              <tbody>
                {allcout.map((index, key) => {
                  return (
                    <tr key={key}>
                      <td>{index.id}</td>
                      <td>{index.depense}</td>
                      <td>${index.cout}</td>
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
                  <td
                    colSpan="2"
                    style={{
                      background: "#002d72",
                      color: "white",
                      fontWeight: "bolder",
                      textAlign: "center",
                    }}
                  >
                    $
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
        )}
      </Grid>
      <Grid size={{ lg: 12 }} sx={{ marginTop: "10px" }}>
        {message && <DirectionSnackbar message={message} />}
        <TextField
          name="Action"
          label="Action effectuée *"
          variant="outlined"
          value={action}
          onChange={(event) => setAction(event.target.value)}
          fullWidth
          multiline
          sx={{
            mb: 2,
          }}
        />
        <TextField
          name="stepSelect"
          label="Next step *"
          variant="outlined"
          value={stepSelect}
          onChange={(event) => onchange(event)}
          fullWidth
          multiline
        />
        <TextField
          name="deedline"
          label="Deedline *"
          variant="outlined"
          value={deedline}
          onChange={(event) => onchange(event)}
          fullWidth
          sx={{
            mt: 2,
          }}
          type="date"
        />
        <TextField
          name="commentaire"
          label="Commentaire"
          variant="outlined"
          value={commentaire}
          onChange={(event) => onchange(event)}
          fullWidth
          multiline
          sx={{
            mt: 2,
          }}
          type="date"
        />
        <div style={{ marginTop: "20px" }}>
          <label className="label" htmlFor="importer">
            Importer le ficher
          </label>
          <input
            onChange={(event) => setFiles(event.target.files)}
            hidden
            multiple
            type="file"
            id="importer"
          />
        </div>

        <Button
          onClick={(event) => sendData(event)}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          <Save fontSize="small" />
          <span style={{ marginLeft: "10px" }}>Enregistrer</span>
        </Button>
      </Grid>
    </Grid>
  );
}

export default AddActionForm;
