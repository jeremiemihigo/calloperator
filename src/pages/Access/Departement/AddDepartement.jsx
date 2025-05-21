import { Button, TextField } from "@mui/material";
import axios from "axios";
import React from "react";
import { config, lien_dt } from "static/Lien";
import Selected from "static/Select";

function AddDepartement({ data, setData }) {
  const [title, setTitle] = React.useState("");
  const [filterBy, setFilterBy] = React.useState("");
  const [type, setType] = React.useState("");
  const [load, setLoad] = React.useState(false);
  const sendData = async (event) => {
    event.preventDefault();
    setLoad(true);
    try {
      const response = await axios.post(
        lien_dt + "/role",
        { title, filterBy, type },
        config
      );
      if (response.status === 200) {
        setData([response.data, ...data]);
        setLoad(false);
        setTitle("");
        setFilterBy("");
        setType("");
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
    <div>
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
      <div style={{ margin: "10px 0px" }}>
        <Selected
          label="Type"
          data={[
            { id: 1, title: "Operation", value: "operation" },
            { id: 2, title: "Suivi", value: "suivi" },
          ]}
          value={type}
          setValue={setType}
        />
      </div>
      <div>
        <Selected
          label="Filter By"
          data={[
            { id: 1, title: "Shop", value: "shop" },
            { id: 2, title: "Region", value: "region" },
            { id: 3, title: "Feedback en cours", value: "currentFeedback" },
          ]}
          value={filterBy}
          setValue={setFilterBy}
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
