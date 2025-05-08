import { Autocomplete, Button, Stack, TextField } from "@mui/material";
import axios from "axios";
import AutoComplement from "Control/AutoComplet";
import DirectionSnackbar from "Control/SnackBar";
import _ from "lodash";
import React from "react";
import { config, lien, lien_dt } from "static/Lien";

function Formulaire() {
  const [value, setValue] = React.useState([]);
  const [feedback, setFeedback] = React.useState("");
  const option = [
    { id: 1, title: "Visites Ménages", value: "vm" },
    { id: 2, title: "Protefeuille", value: "portofolio" },
  ];
  const [sending, setSending] = React.useState({ etat: false, message: "" });
  const { etat, message } = sending;
  const [feedselect, setFeedselect] = React.useState("");
  const sendData = async (event) => {
    event.preventDefault();
    try {
      setSending({ etat: true, message: "" });
      const response = await axios.post(
        lien + "/addfeedback",
        {
          title: feedback,
          nextFeedback: feedselect?.idFeedback,
          plateforme: _.uniq(
            value.map(function (x) {
              return x.value;
            })
          ),
        },
        config
      );
      if (response.status === 200) {
        setSending({ etat: false, message: "Opération effectuée" });
      }
    } catch (error) {
      setSending({ etat: false, message: error.message });
    }
  };
  const [feedbackdt, setFeedbackDt] = React.useState();

  const [load, setLoad] = React.useState(false);
  const FeedbackDt = async () => {
    try {
      setLoad(true);
      const response = await axios.get(lien_dt + "/feedback", config);
      if (response.status === 200) {
        setFeedbackDt(response.data);
        setLoad(false);
      }
    } catch (error) {
      setLoad(false);
    }
  };
  React.useEffect(() => {
    FeedbackDt();
  }, []);
  console.log(feedselect);
  return (
    <div style={{ minWidth: "80%" }}>
      {load ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : (
        <>
          {message && <DirectionSnackbar message={message} />}
          <div>
            <TextField
              onChange={(event) => setFeedback(event.target.value)}
              variant="outlined"
              value={feedback}
              fullWidth
              label="Feedback"
              type="text"
            />
          </div>
          <Stack spacing={3} sx={{ width: "100%", margin: "10px 0px" }}>
            <Autocomplete
              multiple
              value={value}
              id="tags-outlined"
              onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                  setValue({
                    title: newValue,
                  });
                } else if (newValue && newValue.inputValue) {
                  // Create a new value from the user input
                  setValue({
                    title: newValue.inputValue,
                  });
                } else {
                  setValue(newValue);
                }
              }}
              options={option}
              getOptionLabel={(option) => option.title}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select a plateform"
                  placeholder="Plateform"
                />
              )}
            />
          </Stack>
          {feedbackdt && (
            <AutoComplement
              value={feedselect}
              setValue={setFeedselect}
              options={feedbackdt}
              title="Associé à un feedback Default tracker"
              propr="title"
            />
          )}
          <div style={{ marginTop: "10px" }}>
            <Button
              disabled={etat}
              onClick={(event) => sendData(event)}
              variant="contained"
              color="primary"
              fullWidth
            >
              Save feedback
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default Formulaire;
