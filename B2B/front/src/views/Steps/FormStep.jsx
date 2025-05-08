import { Button, TextField } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Addstep } from "../../Redux/step";
import Selected from "../../static/Select";
import DirectionSnackbar from "../../Static/SnackBar";

function FormStep() {
  const data = [
    { id: 1, title: "Project", value: "projet" },
    { id: 2, title: "Prospect", value: "prospect" },
  ];
  const [initiale, setInitiale] = React.useState({ title: "", deedline: "" });
  const { title, deedline } = initiale;
  const [concerne, setConcerne] = React.useState("");
  const steps = useSelector((state) => state.steps);
  const dispatch = useDispatch();
  const sendData = async (event) => {
    event.preventDefault();
    try {
      dispatch(Addstep({ title, concerne, deedline }));
      setInitiale({ title: "", deedline: "" });
      setConcerne("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {steps.savestep === "rejected" && (
        <DirectionSnackbar message={steps.savestepError} />
      )}
      {steps.savestep === "success" && <DirectionSnackbar message="Done" />}
      <TextField
        name="title"
        label="Title"
        variant="outlined"
        value={title}
        onChange={(event) =>
          setInitiale({ ...initiale, title: event.target.value })
        }
        fullWidth
        sx={{
          mb: 2,
          mt: 2,
        }}
      />

      <Selected
        label="Concerne"
        data={data}
        value={concerne}
        setValue={setConcerne}
      />
      <TextField
        name="deedline"
        label="Deedline"
        value={deedline}
        onChange={(event) =>
          setInitiale({ ...initiale, deedline: event.target.value })
        }
        variant="outlined"
        fullWidth
        sx={{
          mt: 2,
        }}
      />
      <Button
        onClick={(event) => sendData(event)}
        color="primary"
        variant="contained"
        disabled={steps.savestep === "pending"}
        fullWidth
        sx={{ mt: 2 }}
      >
        Valider
      </Button>
    </div>
  );
}

export default FormStep;
