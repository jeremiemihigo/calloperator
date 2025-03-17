import { Autocomplete, Paper, TextField } from "@mui/material";
import _ from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { ContextFeedback } from "../Context";
import SelectMany from "./Formular/SelectMany";
import SelectOne from "./Formular/SelectOne";
import TextDate from "./Formular/TextDate";
import SaveComponent from "./SaveComponent";

function Joignable() {
  const { projetSelect, client, values, setValue } =
    React.useContext(ContextFeedback);
  const projet = useSelector((state) => state.projet.projet);
  const [phoneNumber, setPhoneNumber] = React.useState([]);
  const [numberSelect, setNumberSelect] = React.useState([]);

  const [formulaire, setFormulaire] = React.useState();
  React.useEffect(() => {
    let pro = _.filter(projet, { id: projetSelect });
    if (pro.length > 0) {
      setFormulaire(pro[0].questions);
    } else {
      setFormulaire();
    }
  }, [projetSelect]);

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
      {formulaire && client && numberSelect && (
        <Paper sx={{ padding: "10px" }}>
          <div className="question">
            <p>Contact du client</p>
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
          {formulaire.map((index) => {
            return (
              <div key={index._id} className="question">
                {["date", "text"].includes(index.type) && (
                  <div style={{ marginTop: "10px" }}>
                    <TextDate
                      question={index}
                      values={values}
                      setValue={setValue}
                    />
                  </div>
                )}
                {index.type === "select_one" && <SelectOne question={index} />}
                {index.type === "select_many" && (
                  <SelectMany question={index} />
                )}
              </div>
            );
          })}
          {numberSelect.length > 0 && values.length > 0 && (
            <SaveComponent
              donner={{
                feedback: values,
                type: "Reachable",
                date_to_recall: 0,
                contact: numberSelect.join(";"),
              }}
              formulaire={formulaire}
            />
          )}
        </Paper>
      )}
    </div>
  );
}

export default Joignable;
