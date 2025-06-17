import { Edit, Save } from "@mui/icons-material";
import { Autocomplete, Button, Stack, TextField } from "@mui/material";
import axios from "axios";
import DirectionSnackbar from "Control/SnackBar";
import _ from "lodash";
import React from "react";
import { config, lien, lien_dt } from "static/Lien";

function Formulaire({ data_edit, data, setData }) {
  console.log(data_edit);
  const [value, setValue] = React.useState([]);
  const [feedback, setFeedback] = React.useState("");
  const option = [
    { id: 1, title: "Visites Ménages", value: "vm" },
    { id: 2, title: "Protefeuille", value: "portofolio" },
    { id: 3, title: "Default tracker", value: "dt" },
  ];
  const [sending, setSending] = React.useState({ etat: false, message: "" });
  const { etat, message } = sending;

  const [departements, setAllDepartment] = React.useState([]);
  const [incharge, setInCharge] = React.useState([]);
  const loadingRole = async () => {
    try {
      const response = await axios.get(lien_dt + "/role", config);
      if (response.status === 200) {
        setAllDepartment(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loadingRole();
  }, []);
  React.useEffect(() => {
    if (data_edit) {
      setInCharge([]);
      setValue(
        data_edit?.plateforme.map((x) => {
          return option.filter((opt) => opt.value === x)[0];
        })
      );
      setFeedback(data_edit?.title);
    }
  }, [data_edit]);

  const sendData = async (event) => {
    event.preventDefault();
    try {
      setSending({ etat: true, message: "" });
      const donner = {
        title: feedback,

        plateforme: _.uniq(
          value.map(function (x) {
            return x.value;
          })
        ),
        incharge: _.uniq(
          incharge.map(function (x) {
            return x.idRole;
          })
        ),
      };
      const response = await axios.post(lien + "/addfeedback", donner, config);
      if (response.status === 200) {
        setData([response.data, ...data]);
        setSending({ etat: false, message: "Opération effectuée" });
        setValue([]);
        setFeedback("");
        setInCharge([]);
      } else {
        setSending({ etat: false, message: JSON.stringify(response.data) });
      }
    } catch (error) {
      setSending({ etat: false, message: error.message });
    }
  };
  const sendEditData = async (event) => {
    event.preventDefault();
    try {
      setSending({ etat: true, message: "" });
      const donner = {
        title: feedback,
        plateforme: _.uniq(
          value.map(function (x) {
            return x.value;
          })
        ),
        incharge:
          incharge.length > 0
            ? _.uniq(
                incharge.map(function (x) {
                  return x.idRole;
                })
              )
            : data_edit?.plateforme,
      };
      const response = await axios.put(
        lien + "/editfeedback",
        { id: data_edit._id, data: donner },
        config
      );
      if (response.status === 200) {
        setData(
          data.map((x) => (x._id === response.data._id ? response.data : x))
        );
        setSending({ etat: false, message: "Opération effectuée" });
      } else {
        setSending({ etat: false, message: JSON.stringify(response.data) });
      }
    } catch (error) {
      setSending({ etat: false, message: error.message });
    }
  };

  return (
    <div style={{ minWidth: "80%" }}>
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
        {departements.length > 0 && (
          <Stack spacing={3} sx={{ width: "100%", margin: "10px 0px" }}>
            <Autocomplete
              multiple
              value={incharge}
              id="tags-outlined"
              onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                  setInCharge({
                    title: newValue,
                  });
                } else if (newValue && newValue.inputValue) {
                  // Create a new value from the user input
                  setInCharge({
                    title: newValue.inputValue,
                  });
                } else {
                  setInCharge(newValue);
                }
              }}
              options={departements}
              getOptionLabel={(option) => option.title}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Departement en charge"
                  placeholder="Département en charge"
                />
              )}
            />
          </Stack>
        )}

        <div style={{ marginTop: "10px" }}>
          <Button
            disabled={etat}
            onClick={
              data_edit
                ? (event) => sendEditData(event)
                : (event) => sendData(event)
            }
            variant="contained"
            color="primary"
            fullWidth
          >
            {data_edit ? <Edit fontSize="small" /> : <Save fontSize="small" />}
            <span style={{ marginLeft: "10px" }}>
              {data_edit ? "Edit_feedback" : "Save_feedback"}
            </span>
          </Button>
        </div>
      </>
    </div>
  );
}

export default Formulaire;
