import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
} from "@mui/material";
import React from "react";
import Selected from "static/Select";

function SubQuestion({ subquestion, setSubQuestion }) {
  const type = [
    { id: 1, title: "Texte", value: "text" },
    { id: 2, title: "Date", value: "date" },
  ];
  const [typeSelect, setType] = React.useState("text");
  const [required, setRequired] = React.useState(false);
  const [question, setQuestion] = React.useState("");

  const changeData = () => {
    setSubQuestion([
      ...subquestion,
      {
        question,
        required,
        id: new Date().getTime(),
        type: typeSelect,
        allItems: [],
      },
    ]);
    setType("text");
    setRequired(false);
    setQuestion("");
  };

  return (
    <div style={{ maxWidth: "25rem", padding: "10px" }}>
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

        <Grid item lg={6} sx={{ padding: "5px" }}>
          <Button
            onClick={() => changeData()}
            fullWidth
            variant="contained"
            color="primary"
          >
            Apply
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default SubQuestion;
