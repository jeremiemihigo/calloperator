import { Paper, Typography } from "@mui/material";
import React from "react";
import "./formulaire.style.css";

function AffichageQuestion({ data }) {
  return (
    <>
      {data.map((index) => {
        return (
          <Paper key={index._id} elevation={2} className="_paper_one">
            <p className="question">{index.question}</p>
            <div>
              <p className="titre">Type de question</p>
              {index.type === "select_one" && (
                <p className="response">
                  L&apos;utilisateur ne peut s&eacute;lectionner qu&apos;une
                  seule option pour cette question.
                </p>
              )}
              {index.type === "select_many" && (
                <p className="response">
                  L&apos;utilisateur peut s&eacute;lectionner une ou plusieurs
                  options pour cette question.
                </p>
              )}
              {index.type === "text" && (
                <p className="response">
                  Cette question requiert une réponse textuelle de
                  l&apos;utilisateur.
                </p>
              )}
              {index.type === "date" && (
                <p className="response">
                  Cette question requiert une réponse de type date de la part de
                  l&apos;utilisateur.
                </p>
              )}
            </div>
            {index.required ? (
              <p>Cette question est obligatoire</p>
            ) : (
              <p>Cette question n&apos;est pas obligatoire</p>
            )}
            {index.valueSelect.length > 0 &&
              index.valueSelect.map((item) => {
                return (
                  <React.Fragment key={item._id}>
                    <p>{item.title}</p>
                    {item.next_question !== "" && (
                      <p>
                        Next question : {item.next_question}
                        <span
                          style={{
                            fontSize: "20px",
                            position: "absolute",
                            color: "red",
                            fontWeight: "bolder",
                          }}
                        >
                          {item.required ? "*" : ""}
                        </span>
                      </p>
                    )}
                  </React.Fragment>
                );
              })}
            <div className="options">
              <div className="option">
                <Typography component="p">Edit</Typography>
              </div>
            </div>
          </Paper>
        );
      })}
    </>
  );
}

export default AffichageQuestion;
