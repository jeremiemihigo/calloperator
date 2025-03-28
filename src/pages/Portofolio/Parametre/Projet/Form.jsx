import { Save } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import SimpleBackdrop from "Control/Backdrop";
import DirectionSnackbar from "Control/SnackBar";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AjouterProjet } from "Redux/projet";

function Form() {
  const agents = useSelector((state) => state.agentAdmin.agentAdmin);
  const [title, setTitle] = React.useState("");
  const [value, setValue] = React.useState([]);
  const dispatch = useDispatch();
  const projet = useSelector((state) => state.projet);

  const sendData = async () => {
    try {
      let data = {
        title,
        intervenant: value.map((index) => {
          return index.codeAgent;
        }),
      };
      dispatch(AjouterProjet(data));
      setTitle("");
      setValue([]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {projet.addprojet === "pending" && (
        <SimpleBackdrop open={true} title="Please wait..." taille="10rem" />
      )}
      {projet.addprojet === "success" && (
        <DirectionSnackbar message="Opération effectuée" />
      )}
      {projet.addprojet === "rejected" && (
        <DirectionSnackbar message={projet.addprojetError} />
      )}
      <div style={{ marginBottom: "10px" }}>
        <TextField
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          fullWidth
          placeholder="Titre du projet"
          variant="outlined"
        />
      </div>
      <Stack spacing={3} sx={{ width: "100%", marginBottom: "10px" }}>
        <Autocomplete
          multiple
          id="tags-outlined"
          onChange={(event, newValue) => {
            if (typeof newValue === "string") {
              setValue({
                title: newValue,
              });
            } else if (newValue && newValue.inputValue) {
              // Create a new value from the user input
              setValue({
                title: newValue.inputValue,
              });
            } else {
              setValue(newValue);
            }
          }}
          options={agents}
          getOptionLabel={(option) => option.nom}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label="Intervenant"
              placeholder="Select one"
            />
          )}
        />
      </Stack>

      <div style={{ marginTop: "10px" }}>
        <Button
          disabled={value.length === 0 || title === ""}
          onClick={() => sendData()}
          color="primary"
          variant="contained"
          fullWidth
        >
          <Save fontSize="small" />{" "}
          <span style={{ marginLeft: "10px" }}>Save</span>
        </Button>
      </div>
    </>
  );
}

export default Form;
