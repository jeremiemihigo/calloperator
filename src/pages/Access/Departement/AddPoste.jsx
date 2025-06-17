import { Add } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import DirectionSnackbar from "Control/SnackBar";
import React from "react";
import { config, lien_settings } from "static/Lien";
import Selected from "static/Select";

function AddPoste({ posteselect }) {
  const [title, setTitle] = React.useState("");
  const [message, setMessage] = React.useState({ load: false, message: "" });
  const [filterselect, setFilterSelect] = React.useState("");
  const data = [
    { id: 1, title: "Region", value: "region" },
    { id: 2, title: "Shop", value: "shop" },
    { id: 3, title: "Overall", value: "overall" },
  ];

  const sendData = async (e) => {
    e.preventDefault();
    setMessage({ load: true, message: "" });
    try {
      const response = await axios.post(
        `${lien_settings}/poste`,
        { title, filterby: filterselect, idDepartement: posteselect?.idRole },
        config
      );
      if (response.status === 200) {
        setMessage({ load: false, message: "Done" });
        setTitle("");
      } else {
        setMessage({ message: response.data, load: false });
      }
    } catch (error) {
      setMessage({ message: error.message, load: false });
    }
  };
  return (
    <div style={{ minWidth: "20rem" }}>
      {message?.load && <DirectionSnackbar message={message.message} />}
      <div style={{ margin: "10px 0px" }}>
        <TextField
          className="textField"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          label="Poste"
          name="title"
          autoComplete="off"
          fullWidth
        />
      </div>
      <Selected
        label="Select by"
        data={data}
        value={filterselect}
        setValue={setFilterSelect}
      />
      <div style={{ marginTop: "10px" }}>
        <Button
          onClick={(e) => sendData(e)}
          disabled={message.load}
          color="primary"
          variant="contained"
          fullWidth
        >
          <Add fontSize="small" /> Valider
        </Button>
      </div>
    </div>
  );
}

export default AddPoste;
