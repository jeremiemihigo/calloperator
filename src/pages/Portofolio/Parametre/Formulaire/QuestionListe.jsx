import { Paper } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ContextParametre } from '../Context';
import AffichageQuestion from './AffichageQuestion';

function QuestionListe() {
  const { data, loadQuestion, formSelect } = React.useContext(ContextParametre);
  const navigation = useNavigate();

  const addquestion = () => {
    navigation(`/add_question/${formSelect?._id}`, { state: formSelect?.idFormulaire });
  };

  return (
    <div style={{ margin: '20px' }}>
      {loadQuestion && <p>Loading...</p>}
      {!loadQuestion && data.length > 0 && <AffichageQuestion data={data} />}
      {formSelect && (
        <Paper onClick={() => addquestion()} sx={{ padding: '10px', cursor: 'pointer', backgroundColor: 'rgb(0, 169, 244)' }}>
          Clic here to add an other question
        </Paper>
      )}
    </div>
  );
}

export default QuestionListe;
