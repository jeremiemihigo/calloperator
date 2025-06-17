import { Button, TextField } from "@mui/material";
import axios from "axios";
import React from "react";
import { config, lien_dt } from "static/Lien";

function AddDepartement({ data, setData }) {
  const [title, setTitle] = React.useState("");
  const [load, setLoad] = React.useState(false);
  const sendData = async (event) => {
    event.preventDefault();
    setLoad(true);
    try {
      const response = await axios.post(lien_dt + "/role", { title }, config);
      if (response.status === 200) {
        setData([response.data, ...data]);
        setLoad(false);
        setTitle("");
      } else {
        setLoad(false);
        alert(JSON.stringify(response.data));
      }
    } catch (error) {
      setLoad(false);
      alert(JSON.stringify(error.message));
    }
  };
  return (
    <div style={{ width: "20rem", padding: "10px" }}>
      <div>
        <TextField
          className="textField"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          label="Department"
          name="title"
          autoComplete="off"
          fullWidth
        />
      </div>
      <div style={{ marginTop: "10px" }}>
        <Button
          onClick={(event) => sendData(event)}
          variant="contained"
          color="primary"
          disabled={load}
          fullWidth
        >
          Add
        </Button>
      </div>
    </div>
  );
}
//title, filterBy, type
export default AddDepartement;
