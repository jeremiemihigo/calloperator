import _ from "lodash";
import React from "react";
import { ContextFeedback } from "../../Context";
import TextDate from "./TextDate";

function SubQuestion({ question }) {
  const { values } = React.useContext(ContextFeedback);
  const { valueSelect } = question;
  const [reponse, setReponse] = React.useState("");
  React.useEffect(() => {
    if (
      question &&
      values &&
      _.filter(values, { idQuestion: question.id }).length > 0
    ) {
      setReponse(_.filter(values, { idQuestion: question.id })[0].reponse);
    }
  }, [values, question]);
  return (
    <div>
      {reponse !== "" &&
        _.filter(valueSelect, { question: reponse })[0].allItems.map(
          (index, key) => {
            return (
              <React.Fragment key={key}>
                {["text", "date"].includes(index.type) && (
                  <TextDate question={index} />
                )}
              </React.Fragment>
            );
          }
        )}
    </div>
  );
}

export default SubQuestion;
