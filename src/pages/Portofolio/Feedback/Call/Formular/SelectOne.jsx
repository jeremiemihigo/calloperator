import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import React from "react";
import { ContextFeedback } from "../../Context";
import Question from "./Question";
import SubQuestion from "./SubQuestion";

function SelectOne({ question }) {
  const { handleChange, values } = React.useContext(ContextFeedback);

  const valueSelect = (id, value) => {
    let q = values.filter((x) => x.idQuestion === id);
    if (q.length > 0) {
      if (q[0].reponse === value) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  return (
    <div>
      {<Question texte={question.question} />}
      {question.valueSelect.map((item, key) => {
        return (
          <React.Fragment key={key}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={valueSelect(question.id, item.question)}
                    onChange={(event) => handleChange(event)}
                    value={item.question}
                  />
                }
                label={item.question}
                name={question.id}
              />
            </FormGroup>
          </React.Fragment>
        );
      })}
      <SubQuestion question={question} values={values} />
    </div>
  );
}

export default SelectOne;
