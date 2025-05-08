import { Autocomplete, Paper, TextField } from "@mui/material";
import _ from "lodash";
import React from "react";
import Selected from "static/Select";
import { ContextFeedback } from "../Context";
import SaveComponent from "./SaveComponent";

function Injoignable() {
  const { client } = React.useContext(ContextFeedback);
  const data = [
    {
      id: 1,
      title: "Le client de prend pas le téléphone",
      value: "Le client de prend pas le téléphone",
    },
    { id: 2, title: "Le numero ne passe pas", value: "Le numero ne passe pas" },
    { id: 3, title: "Le client a raccroché", value: "Le client a raccroché" },
    {
      id: 4,
      title: "Le client a bloqué le numéro",
      value: "Le client a bloqué le numéro",
    },
    { id: 5, title: "Autres", value: "Autres" },
  ];
  const [feedback, setFeedback] = React.useState("");

  const [phoneNumber, setPhoneNumber] = React.useState([]);
  const [numberSelect, setNumberSelect] = React.useState([]);
  React.useEffect(() => {
    if (client) {
      const { first_number, second_number, payment_number } = client;
      setPhoneNumber(
        _.uniq([first_number, second_number, payment_number]).filter(
          (x) => x !== ""
        )
      );
    }
  }, [client]);

  return (
    <Paper sx={{ padding: "10px" }}>
      <div>
        <Autocomplete
          multiple
          value={numberSelect}
          disabled={phoneNumber.length === 0 ? true : false}
          id="tags-outlined"
          onChange={(event, newValue) => {
            if (typeof newValue === "string") {
              setNumberSelect({
                title: newValue,
              });
            } else if (newValue && newValue.inputValue) {
              // Create a new value from the user input
              setNumberSelect({
                title: newValue.inputValue,
              });
            } else {
              setNumberSelect(newValue);
            }
          }}
          options={phoneNumber}
          getOptionLabel={(option) => option}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label="Phone number"
              placeholder={
                phoneNumber.length === 0
                  ? "No Phone number upload for this customer"
                  : "Select a number"
              }
            />
          )}
        />
      </div>
      <div style={{ margin: "10px 0px" }}>
        <Selected
          label="Select Feedback"
          data={data}
          value={feedback}
          setValue={setFeedback}
        />
      </div>
      {feedback === "Autres" && (
        <TextField
          onChange={(event) => setFeedback(event.target.value)}
          label="Autres"
          fullWidth
        />
      )}

      {(numberSelect.length > 0 || feedback !== "") && (
        <SaveComponent
          donner={{
            type: "Unreachable",
            feedback: {
              sinon: { texte: "", date: "" },
              sioui: { texte: "", date: "" },
            },
            unreachable_feedback: feedback,
            contact: numberSelect.join(";"),
          }}
        />
      )}
    </Paper>
  );
}

export default Injoignable;
