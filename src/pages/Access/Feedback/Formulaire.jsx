import { Edit, Save } from "@mui/icons-material";
import { Autocomplete, Button, Stack, TextField } from "@mui/material";
import axios from "axios";
import DirectionSnackbar from "Control/SnackBar";
import _ from "lodash";
import React from "react";
import { config, lien, lien_dt } from "static/Lien";
import Selected from "static/Select";

function Formulaire({ data_edit, data, postes, setData }) {
  const [value, setValue] = React.useState([]);
  const [feedback, setFeedback] = React.useState("");
  const option = [
    { _id: 1, title: "Visites Ménages", value: "vm" },
    { _id: 2, title: "Protefeuille", value: "portofolio" },
    { _id: 3, title: "Default tracker", value: "dt" },
  ];
  const encharge = [
    { id: 1, title: "Poste", value: "poste" },
    { id: 2, title: "Departement", value: "departement" },
  ];
  const [role, setRole] = React.useState("");
  const [sending, setSending] = React.useState({ etat: false, message: "" });
  const { etat, message } = sending;

  const [departements, setAllDepartment] = React.useState([]);
  const [posteselect, setPosteSelect] = React.useState([]);
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
      setRole(data_edit?.typecharge);
    }
  }, [data_edit]);

  const sendData = async (event) => {
    event.preventDefault();
    const en =
      role === "departement"
        ? _.uniq(
            incharge.map(function (x) {
              return x.idRole;
            })
          )
        : posteselect.map(function (x) {
            return x.id;
          });
    try {
      setSending({ etat: true, message: "" });
      const donner = {
        title: feedback,

        plateforme: _.uniq(
          value.map(function (x) {
            return x.value;
          })
        ),
        incharge: en,
        typecharge: role,
      };
      const response = await axios.post(lien + "/addfeedback", donner, config);
      if (response.status === 200) {
        setData([response.data, ...data]);
        setSending({ etat: false, message: "Opération effectuée" });
        setValue([]);
        setFeedback("");
        setInCharge([]);
        setPosteSelect([]);
        setRole("");
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
      const en =
        role === "departement"
          ? _.uniq(
              incharge.map(function (x) {
                return x.idRole;
              }) || data_edit?.incharge
            )
          : posteselect.map(function (x) {
              return x.id;
            }) || data_edit?.incharge;
      const donner = {
        title: feedback,
        plateforme: _.uniq(
          value.map(function (x) {
            return x.value;
          })
        ),
        idRole: en,
        typecharge: role,
      };
      console.log(donner);
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
    <div style={{ minWidth: "20rem" }}>
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
        <div>
          <Selected
            label="En charge"
            data={encharge}
            value={role}
            setValue={setRole}
          />
        </div>
        {departements.length > 0 && role === "departement" && (
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
        {postes && postes.length > 0 && role === "poste" && (
          <Stack spacing={3} sx={{ width: "100%", margin: "10px 0px" }}>
            <Autocomplete
              multiple
              value={posteselect}
              id="tags-outlined"
              onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                  setPosteSelect({
                    title: newValue,
                  });
                } else if (newValue && newValue.inputValue) {
                  // Create a new value from the user input
                  setPosteSelect({
                    title: newValue.inputValue,
                  });
                } else {
                  setPosteSelect(newValue);
                }
              }}
              options={postes}
              getOptionLabel={(option) => option.title}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Poste en charge"
                  placeholder="Poste en charge"
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
