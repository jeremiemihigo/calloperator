import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  TextField,
} from "@mui/material";
import AutoComplement from "Control/AutoComplet";
import _ from "lodash";
import React from "react";
import { ContextFeedback } from "../Context";
import Question from "./Formular/Question";
import SaveComponent from "./SaveComponent";

function Joignable() {
  const { client, feedback } = React.useContext(ContextFeedback);
  const [phoneNumber, setPhoneNumber] = React.useState([]);
  const [numberSelect, setNumberSelect] = React.useState([]);
  const [fonctionne, setFonctionne] = React.useState("");
  const [sinon, setSiNon] = React.useState({ texte: "", date: "" });
  const [sioui, setSiOui] = React.useState({ texte: "", date: "" });
  const [toutvabien, setToutvabien] = React.useState("");

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
    <div>
      <Paper sx={{ padding: "10px" }}>
        <div className="question">
          <Question texte="Contact client" />
          <div style={{ marginTop: "10px" }}>
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
        </div>
        <div className="question">
          <Question texte="Bonjour Monsieur/ Madame, je suis .......... du service client de BBOXX, nous voulons savoir si le materiel de BBOXX fonctionne bien chez vous ?" />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={fonctionne === "OUI"}
                  onChange={() => setFonctionne("OUI")}
                />
              }
              label="OUI"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={fonctionne === "NON"}
                  onChange={() => setFonctionne("NON")}
                />
              }
              label="NON"
            />
          </FormGroup>
          {fonctionne === "NON" && (
            <>
              <Question texte="Si Non, pourriez vous nous dire si ça ne fonctionne pas bien pourquoi?" />
              <TextField
                onChange={(event) =>
                  setSiNon({
                    ...sinon,
                    texte: event.target.value,
                  })
                }
                variant="outlined"
                value={sinon.texte}
                fullWidth
                label="Feedback"
                type="text"
              />
              <Question texte="Vu que votre système est désactivé vous comptez vous réactiver quel jour?" />
              <TextField
                onChange={(event) =>
                  setSiNon({
                    ...sinon,
                    date: event.target.value,
                  })
                }
                variant="outlined"
                value={sinon.date}
                fullWidth
                type="date"
              />
            </>
          )}

          {fonctionne === "OUI" && (
            <>
              <Question texte="Si tout va bien chez vous, Monsieur / Madame, nous aurons besoin de savoir la raison du non-paiement de votre Kit solaire BBOXX." />

              <AutoComplement
                value={toutvabien}
                setValue={setToutvabien}
                options={feedback}
                title="Feedback"
                propr="title"
              />
              <div style={{ marginTop: "10px" }}>
                {toutvabien?.idFeedback === "autre" && (
                  <TextField
                    onChange={(event) =>
                      setSiOui({
                        ...sioui,
                        texte: event.target.value,
                      })
                    }
                    variant="outlined"
                    value={sioui.texte}
                    fullWidth
                    label="Feedback about this question"
                    type="text"
                  />
                )}
              </div>
              <Question texte="Et vous comptez vous réactiver quand?" />
              <TextField
                onChange={(event) =>
                  setSiOui({
                    ...sioui,
                    date: event.target.value,
                  })
                }
                variant="outlined"
                fullWidth
                value={sioui.date}
                type="date"
              />
            </>
          )}
        </div>
        <SaveComponent
          donner={{
            feedback: { sinon, sioui },
            type: "Reachable",
            date_to_recall: 0,
            toutvabien,
            fonctionne,
            unreachable_feedback: "",
            contact: numberSelect.join(";"),
          }}
        />
      </Paper>
    </div>
  );
}

export default Joignable;
