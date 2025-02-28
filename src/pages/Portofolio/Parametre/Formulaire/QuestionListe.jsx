import { Paper, Typography } from '@mui/material';
import _ from 'lodash';
import React from 'react';
import { ContextParametre } from '../Context';

function QuestionListe() {
  const { data, loadQuestion } = React.useContext(ContextParametre);
  const returnNextQuestion = (id) => {
    return _.filter(data, { id })[0].question;
  };

  return (
    <div style={{ margin: '20px' }}>
      {loadQuestion && <p>Loading...</p>}
      {!loadQuestion &&
        data.length > 0 &&
        data.map((index) => {
          return (
            <Paper key={index._id} elevation={2} className="_paper_one">
              <p className="question">{index.question}</p>
              <div>
                <p className="titre">Type de question</p>
                {index.type === 'select_one' && (
                  <p className="response">L&apos;utilisateur ne peut s&eacute;lectionner qu&apos;une seule option pour cette question.</p>
                )}
                {index.type === 'select_many' && (
                  <p className="response">L&apos;utilisateur peut s&eacute;lectionner une ou plusieurs options pour cette question.</p>
                )}
                {index.type === 'text' && <p className="response">Cette question requiert une réponse textuelle de l&apos;utilisateur.</p>}
                {index.type === 'date' && (
                  <p className="response">Cette question requiert une réponse de type date de la part de l&apos;utilisateur.</p>
                )}
              </div>
              {index.required ? <p>Cette question est obligatoire</p> : <p>Cette question n&apos;est pas obligatoire</p>}
              {index.valueSelect.length > 0 &&
                index.valueSelect.map((item) => {
                  return (
                    <React.Fragment key={item._id}>
                      <p>{item.title}</p>
                      {item.next_question !== '' && <p>Next question : {returnNextQuestion(item.next_question)}</p>}
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
    </div>
  );
}

export default QuestionListe;
