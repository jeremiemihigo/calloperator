import { Checkbox, FormControl, FormControlLabel, Grid, Paper, Typography } from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import React from 'react';
import { useParams } from 'react-router-dom';
import ExcelButton from 'static/ExcelButton';
import { config, lien_terrain } from 'static/Lien';
import Popup from 'static/Popup';
import Question from './Question';
import RequiredAt from './RequiredAt';
import './servey.style.css';

function Detail() {
  const params = useParams();
  const idServey = params?.id;
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState({ questions: [], servey: {} });

  const { questions, servey } = data;
  const [reponses, setReponses] = React.useState();

  const loading = async () => {
    try {
      const response = await axios.get(`${lien_terrain}/readAllReponse/${idServey}`, config);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const loadingReponse = async () => {
    try {
      const response = await axios.get(`${lien_terrain}/fichier_servey/${idServey}`, config);
      setReponses(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    loadingReponse();
    loading();
  }, [idServey]);

  const [obligatoire, setObligatoire] = React.useState(false);
  const returnReponse = (questio, agent) => {
    let filtrer = reponses.filter((x) => x.codeAgent === agent);
    if (filtrer.length > 0) {
      return reponses.filter((x) => x.codeAgent === agent)[0]['' + questio];
    } else {
      return '';
    }
  };
  const [openquestion, setOpenQuestion] = React.useState(false);

  return (
    <div>
      {servey && (
        <Paper elevation={3} className="papier">
          <Grid container>
            <Grid item lg={6} className="leftitem">
              <p className="title">{servey.title}</p>
              <p className="subtitle">{servey.subtitle}</p>
            </Grid>
            <Grid item lg={2}>
              <p>Closed at {moment(servey.dateFin).fromNow()}</p>
              <p>
                Concerne les{' '}
                {servey?.concerne?.map((index, key) => {
                  return <span key={key}>{index + '; '}</span>;
                })}
              </p>
            </Grid>
            <Grid item lg={4}>
              <FormControl component="fieldset" variant="standard">
                <FormControlLabel
                  control={<Checkbox checked={obligatoire} onChange={() => setObligatoire(!obligatoire)} value={obligatoire} />}
                  label="Obligatoire à ceux qui n'ont pas encore repondu"
                />
              </FormControl>
              <Typography
                sx={{ color: 'blue', fontWeight: 'bolder', cursor: 'pointer', fontSize: '12px', marginBottom: '10px' }}
                onClick={() => setOpen(true)}
                component="p"
              >
                Cliquez ici pour ajouter une question
              </Typography>
              <Typography
                sx={{ fontWeight: 'bolder', cursor: 'pointer', fontSize: '12px', marginBottom: '10px' }}
                onClick={() => setOpenQuestion(true)}
                component="p"
              >
                Cliquez ici pour voir le questionnaire
              </Typography>
              <ExcelButton data={reponses} title="Exporter_en_Excel" fileName={`${servey?.title}.xlsx`} />
            </Grid>
          </Grid>
        </Paper>
      )}
      <Popup open={openquestion} setOpen={setOpenQuestion} title="Questionnaire">
        {questions &&
          questions.length > 0 &&
          questions.map((index) => {
            return (
              <div key={index._id} className="q">
                <p className="q_title">
                  {index.question} <span className="q_type">{index.type_reponse}</span>
                </p>

                {['select_one', 'select_many'].includes(index.type_reponse) &&
                  index.item.map((item, cle) => {
                    return (
                      <span className="q_item" key={cle}>
                        {item + '; '}
                      </span>
                    );
                  })}
              </div>
            );
          })}
      </Popup>
      <Paper elevation={2} sx={{ padding: '5px' }}>
        <table>
          <thead>
            <tr>
              <td>#</td>
              <td>Code agent</td>
              {questions &&
                questions.map((index) => {
                  return <td key={index._id}>{index.question}</td>;
                })}
            </tr>
          </thead>
          <tbody>
            {reponses &&
              reponses.map((index, key) => {
                return (
                  <tr key={key}>
                    <td>{key + 1}</td>
                    <td>{index.codeAgent}</td>
                    {questions &&
                      questions.map((item) => {
                        return <td key={item._id}>{returnReponse(item.question, index.codeAgent)}</td>;
                      })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </Paper>
      <Popup open={open} setOpen={setOpen} title="Add question">
        <Question idServey={idServey} />
      </Popup>
      <Popup open={obligatoire} setOpen={setObligatoire} title="Required at">
        <RequiredAt id={servey?._id} />
      </Popup>
    </div>
  );
}

export default Detail;
