import { Autocomplete, Paper, TextField } from "@mui/material";
import React from "react";
import { ContextFeedback } from "../Context";
import SaveComponent from "./SaveComponent";

function Rappeler() {
  const [raison, setRaison] = React.useState("");
  const [date, setDate] = React.useState("");
  const { client } = React.useContext(ContextFeedback);
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
    <Paper sx={{ padding: "20px" }}>
      <div style={{ marginBottom: "10px" }}>
        <TextField
          fullWidth
          value={raison}
          onChange={(event) => setRaison(event.target.value)}
          label="raison"
          variant="outlined"
          type="text"
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
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
      <div>
        <TextField
          variant="outlined"
          fullWidth
          value={date}
          onChange={(event) => setDate(event.target.value)}
          label="La date qu'on rappelera le client"
          type="date"
        />
      </div>
      {raison && date && numberSelect.length > 0 && (
        <SaveComponent
          donner={{
            feedback: {
              sinon: { texte: "", date: "" },
              sioui: { texte: "", date: "" },
            },
            unreachable_feedback: "",
            raison_rappel: raison,
            date_to_recall: date,
            contact: numberSelect.join(";"),
            type: "Remind",
          }}
        />
      )}
    </Paper>
  );
}

export default Rappeler;
