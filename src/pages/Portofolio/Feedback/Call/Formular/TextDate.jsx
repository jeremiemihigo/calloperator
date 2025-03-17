import { TextField } from "@mui/material";
import React from "react";
import { ContextFeedback } from "../../Context";
import Question from "./Question";

function TextDate({ question }) {
  const { handleChange } = React.useContext(ContextFeedback);

  return (
    <div>
      {<Question texte={question.question} />}
      <TextField
        onChange={(event) => handleChange(event)}
        variant="outlined"
        fullWidth
        label="Feedback about this question"
        name={question.id}
        type={question.type}
      />
    </div>
  );
}

export default TextDate;
