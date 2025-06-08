import { Message } from "@mui/icons-material";
import { Button, Grid, TextField } from "@mui/material";
import AutoComplement from "Control/AutoComplet";
import _ from "lodash";
import React from "react";
import { useDispatch } from "react-redux";
import { Ajoutercommunication, UpdateCommunication } from "Redux/Communication";
import { Delete, Edit } from "../../../node_modules/@mui/icons-material/index";
import "./communication.style.css";

function FormMessage({ dataToUpdate, setDataToUpdate }) {
  const [title, setTitle] = React.useState("");
  const [date, setDate] = React.useState();
  const [fonction, setFonction] = React.useState("");
  const [content, setContent] = React.useState("");
  const dispatch = useDispatch();
  const annuler = () => {
    setDataToUpdate();
    setTitle("");
    setDate("");
    setContent("");
    setFonction("");
  };

  const sendData = async (e) => {
    try {
      e.preventDefault();
      dispatch(
        Ajoutercommunication({
          title,
          content,
          date,
          concerne: fonction?.value,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const label = [
    { id: 1, title: "Technicien (TECH)", value: "tech" },
    { id: 2, title: "Agent (SA)", value: "agent" },
    { id: 3, title: "Zonal_Business_Manager", value: "ZBM" },
    { id: 4, title: "Process_Officer", value: "PO" },
    { id: 5, title: "RS", value: "RS" },
    { id: 6, title: "Shop_Manager", value: "SM" },
    { id: 7, title: "Team_leader", value: "TL" },
    { id: 8, title: "Stagiaire", value: "stagiaire" },
    { id: 8, title: "Agent_de_recouvrement_(AR)", value: "AR" },
    { id: 9, title: "Shop_Assistante", value: "shop_assistante" },
    { id: 10, title: "Pour tous", value: "all" },
  ];
  React.useEffect(() => {
    if (dataToUpdate) {
      setTitle(dataToUpdate?.title);
      setDate(dataToUpdate?.date);
      setContent(dataToUpdate?.content);
      let d = _.filter(label, { value: dataToUpdate?.concerne });
      setFonction(d[0]);
    }
  }, [dataToUpdate]);

  const sendEdit = (e) => {
    e.preventDefault();
    try {
      dispatch(
        UpdateCommunication({
          id: dataToUpdate._id,
          data: { title, content, date, concerne: fonction?.value },
        })
      );
      annuler();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <p
        style={{ textAlign: "center", padding: 0, margin: 0, fontSize: "10px" }}
      >
        @name: pour afficher le nom de l&apos;agent dans le message
      </p>
      <p style={{ textAlign: "center", fontSize: "10px" }}>
        @p: pour un paragraphe
      </p>
      <div className="mb-3">
        <Grid sx={{ marginTop: "10px" }}>
          <AutoComplement
            value={fonction}
            setValue={setFonction}
            options={label}
            title="Concerne"
            propr="title"
          />
        </Grid>
      </div>
      <div style={{ marginBottom: "5px" }}>
        <TextField
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginTop: "10px" }}
          name="title"
          autoComplete="off"
          fullWidth
          value={title}
          label="Objet"
        />
      </div>
      <div style={{ marginBottom: "5px" }}>
        <TextField
          id="outlined-multiline-static"
          label="Message"
          multiline
          fullWidth
          rows={7}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: "5px" }}>
        <TextField
          onChange={(e) => setDate(e.target.value)}
          style={{ marginTop: "10px" }}
          name="date"
          autoComplete="off"
          type="date"
          fullWidth
          value={date}
          label="Date d'expiration"
        />
      </div>

      <Grid sx={{ marginTop: "10px" }} container>
        <Grid item lg={6}>
          {" "}
          <Button
            onClick={dataToUpdate ? (e) => sendEdit(e) : (e) => sendData(e)}
            fullWidth
            color="primary"
            variant="contained"
          >
            {dataToUpdate ? (
              <Edit fontSize="small" sx={{ marginRight: "15px" }} />
            ) : (
              <Message fontSize="small" sx={{ marginRight: "15px" }} />
            )}

            {dataToUpdate ? "Edit" : "Create_message"}
          </Button>
        </Grid>
        <Grid item lg={6} sx={{ paddingLeft: "5px" }}>
          {" "}
          {dataToUpdate && (
            <Button
              onClick={() => annuler()}
              fullWidth
              color="warning"
              variant="contained"
            >
              <Delete fontSize="small" sx={{ marginRight: "15px" }} />
              Annuler
            </Button>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default FormMessage;
