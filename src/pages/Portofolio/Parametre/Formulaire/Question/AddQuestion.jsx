import { Save } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import SimpleBackdrop from "Control/Backdrop";
import DirectionSnackbar from "Control/SnackBar";
import React from "react";
import { useSelector } from "react-redux";
import { config, portofolio } from "static/Lien";
import Popup from "static/Popup";
import Selected from "static/Select";
import SubQuestion from "./SubQuestion";

function AddQuestion({ state }) {
  //select_one", "select_many", "text", "date"
  const [data, setData] = React.useState([]);
  const type = [
    { id: 1, title: "Select one", value: "select_one" },
    { id: 2, title: "Select many", value: "select_many" },
    { id: 3, title: "Texte", value: "text" },
    { id: 4, title: "Date", value: "date" },
  ];
  const user = useSelector((state) => state.user.user);
  const [typeSelect, setType] = React.useState("");
  const [required, setRequired] = React.useState(false);
  const [question, setQuestion] = React.useState("");
  const [item, setItem] = React.useState("");
  const [allItems, setAllItems] = React.useState([]);

  const [sending, setSending] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [subquestion, setSubQuestion] = React.useState([]);

  const sendData = async () => {
    try {
      setSending(true);
      const response = await axios.post(
        portofolio + "/addQuestion",
        { data },
        config
      );
      if (response.status === 200) {
        setMessage("Done");
        setSending(false);
        setData([]);
      } else {
        setMessage("" + response.data);
        setSending(false);
      }
    } catch (error) {
      setMessage("" + error.message);
      setSending(false);
    }
  };
  const [open, setOpen] = React.useState(false);

  const ApplyData = () => {
    setData([
      ...data,
      {
        id: new Date().getTime(),
        savedBy: user.nom,
        idFormulaire: state,
        type: typeSelect,
        question,
        required,
        valueSelect: allItems,
      },
    ]);
    setSubQuestion([]);
    setQuestion("");
    setRequired(false);
    setType("");
  };
  return (
    <>
      <Paper sx={{ padding: "10px" }}>
        {message && <DirectionSnackbar message={message} />}
        <SimpleBackdrop open={sending} title="Please wait..." taille="10rem" />
        <Grid container>
          <Grid item lg={12}>
            <TextField
              fullWidth
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              label="Question"
              variant="outlined"
            />
          </Grid>
          <Grid item lg={12} sx={{ margin: "10px 0px" }}>
            <Selected
              label="Type de question"
              data={type}
              value={typeSelect}
              setValue={setType}
            />
          </Grid>
          <Grid item lg={12}>
            <Box sx={{ display: "flex" }}>
              <FormControl component="fieldset" variant="standard">
                <FormGroup>
                  <FormControlLabel
                    onClick={() => setRequired(!required)}
                    control={<Checkbox checked={required} name="obligatoire" />}
                    label="La question est obligatoire ?"
                  />
                </FormGroup>
              </FormControl>
            </Box>
          </Grid>
          {["select_one", "select_many"].includes(typeSelect) && (
            <Grid item lg={12}>
              <TextField
                sx={{ width: "80%" }}
                value={item}
                onChange={(event) => setItem(event.target.value)}
                label="Item"
                variant="outlined"
              />
              <input
                type="submit"
                value="Save"
                style={{
                  height: "100%",
                  width: "18%",
                  marginLeft: "3px",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setAllItems([
                    ...allItems,
                    {
                      question: item,
                      id: new Date().getTime(),
                      required,
                      allItems: subquestion,
                    },
                  ]);
                  setItem("");
                  setSubQuestion([]);
                }}
              />
            </Grid>
          )}

          {typeSelect === "select_one" && (
            <Grid
              onClick={() => setOpen(true)}
              item
              lg={12}
              sx={{ margin: "10px 0px", cursor: "pointer" }}
            >
              <div>
                <Typography component="p">
                  Click here to add a sub question
                </Typography>
              </div>
            </Grid>
          )}

          <Grid item lg={6} sx={{ padding: "5px" }}>
            <Button
              onClick={() => ApplyData()}
              fullWidth
              variant="contained"
              color="primary"
            >
              Apply
            </Button>
          </Grid>
          <Grid item lg={6} sx={{ padding: "5px" }}>
            <Button
              // disabled={typeSelect !== '' && required && question !== '' && item !== ''}
              onClick={() => sendData()}
              fullWidth
              variant="contained"
              color="primary"
            >
              <Save fontSize="small" />{" "}
              <span style={{ marginLeft: "10px" }}>Save Modification</span>
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Popup open={open} setOpen={setOpen} title="Add a sub question">
        <SubQuestion
          subquestion={subquestion}
          setSubQuestion={setSubQuestion}
        />
      </Popup>
    </>
  );
}

export default AddQuestion;
