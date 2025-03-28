import { Checkbox, TextField, Typography } from "@mui/material";
import AutoComplement from "Control/AutoComplet";
import React from "react";
import { sat } from "static/database";
import { CreateContexteTable } from "../Contexte";
import ButtonEsc from "./ButtonEsc";

function InfoClient() {
  const [select, setSelect] = React.useState("");

  const { onchange, state, satSelect, setSatSelect } =
    React.useContext(CreateContexteTable);
  const { new_contact, commune, quartier, avenue, reference } = state;

  const changeOption = (value) => {
    setSelect(value);
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <Typography
          onClick={() => changeOption("contact")}
          component="span"
          style={{ cursor: "pointer" }}
        >
          <Checkbox checked={select == "contact" ? true : false} />
          <label htmlFor="contact">Contact</label>
        </Typography>
        <Typography
          onClick={() => changeOption("adresse")}
          component="span"
          style={{ cursor: "pointer", marginLeft: "20px" }}
        >
          <Checkbox checked={select == "adresse" ? true : false} />
          <label htmlFor="adresse">Adresses</label>
        </Typography>
      </div>
      {select === "contact" && (
        <>
          <div style={{ marginTop: "10px" }}>
            <TextField
              value={new_contact}
              onChange={(e) => onchange(e)}
              name="new_contact"
              autoComplete="off"
              fullWidth
              label="Customer Contact"
            />
          </div>
        </>
      )}
      {select === "adresse" && (
        <>
          <div style={{ marginBottom: "10px" }}>
            <TextField
              onChange={(e) => onchange(e)}
              style={{ marginTop: "10px" }}
              name="commune"
              value={commune}
              autoComplete="off"
              fullWidth
              label="Commune"
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <TextField
              onChange={(e) => onchange(e)}
              style={{ marginTop: "10px" }}
              name="quartier"
              autoComplete="off"
              fullWidth
              value={quartier}
              label="Quartier"
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <TextField
              onChange={(e) => onchange(e)}
              style={{ marginTop: "10px" }}
              name="avenue"
              value={avenue}
              autoComplete="off"
              fullWidth
              label="avenue"
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <TextField
              onChange={(e) => onchange(e)}
              style={{ marginTop: "10px" }}
              name="reference"
              autoComplete="off"
              value={reference}
              fullWidth
              label="Reference"
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <AutoComplement
              value={satSelect}
              setValue={setSatSelect}
              options={sat}
              title="Sat"
              propr="nom_SAT"
            />
          </div>
        </>
      )}
      {select && (
        <div style={{ marginTop: "10px" }}>
          <ButtonEsc
            title="Escalader_vers_le_Backoffice"
            statut="Customer Information"
          />
        </div>
      )}
    </div>
  );
}

export default InfoClient;
