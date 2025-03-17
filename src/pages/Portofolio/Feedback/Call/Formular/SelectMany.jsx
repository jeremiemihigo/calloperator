import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import React from "react";
import { ContextFeedback } from "../../Context";
import Question from "./Question";

function SelectMany({ question }) {
  const { handleChangeBoxMany } = React.useContext(ContextFeedback);

  return (
    <div>
      {<Question texte={question.question} />}
      {question.valueSelect.map((item, key) => {
        <React.Fragment key={key}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(event) => handleChangeBoxMany(event)}
                  value={item.question}
                />
              }
              label={item.question}
              name={item.id}
            />
          </FormGroup>
        </React.Fragment>;
      })}
    </div>
  );
}

export default SelectMany;
