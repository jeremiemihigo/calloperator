import { Button, TextField } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { Addcategorie } from "../../../Redux/categorisation";

function Ajouter() {
  const [title, setTitle] = React.useState("");
  const dispatch = useDispatch();
  const sendData = (event) => {
    event.preventDefault();
    try {
      dispatch(Addcategorie({ title }));
      setTitle("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <TextField
        name="title"
        label="Titre"
        variant="outlined"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        fullWidth
        multiline
        sx={{
          mt: 2,
          mb: 2,
          minWidth: "20rem",
        }}
      />
      <Button
        onClick={(event) => sendData(event)}
        variant="contained"
        color="primary"
        fullWidth
      >
        Send
      </Button>
    </div>
  );
}

export default Ajouter;
