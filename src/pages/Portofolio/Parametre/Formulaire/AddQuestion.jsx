import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, TextField } from '@mui/material';
import axios from 'axios';
import SimpleBackdrop from 'Control/Backdrop';
import DirectionSnackbar from 'Control/SnackBar';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, portofolio } from 'static/Lien';
import Selected from 'static/Select';
import { ContextParametre } from '../Context';

function AddQuestion() {
  //select_one", "select_many", "text", "date"
  const { formSelect, data, setData } = React.useContext(ContextParametre);
  const user = useSelector((state) => state.user.user);
  const type = [
    { id: 1, title: 'Select one', value: 'select_one' },
    { id: 2, title: 'Select many', value: 'select_many' },
    { id: 3, title: 'Texte', value: 'text' },
    { id: 4, title: 'Date', value: 'date' }
  ];
  const [typeSelect, setType] = React.useState('');
  const [required, setRequired] = React.useState(false);
  const [question, setQuestion] = React.useState('');
  const [item, setItem] = React.useState([]);
  const [allItems, setAllItems] = React.useState([]);
  const [next_question, setNextQuestion] = React.useState('');

  const changeData = () => {
    setData([
      ...data,
      {
        type: typeSelect,
        required,
        question,
        idFormulaire: formSelect?.idFormulaire,
        savedBy: user?.nom,
        valueSelect: allItems,
        id: new Date().getTime()
      }
    ]);

    setType('');
    setRequired(false);
    setQuestion('');
    setItem([]);
    setAllItems([]);
    setNextQuestion('');
  };
  const [sending, setSending] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const sendData = async () => {
    try {
      let filter = data.filter((x) => x._id === undefined);
      console.log(filter);
      setSending(true);
      const response = await axios.post(portofolio + '/addQuestion', { data: filter }, config);
      if (response.status === 200) {
        setMessage('Done');
        setSending(false);
      } else {
        setMessage('' + response.data);
        setSending(false);
      }
    } catch (error) {
      console.log(error);
      setMessage('' + error.message);
      setSending(false);
    }
  };

  return (
    <>
      {message && <DirectionSnackbar message={message} />}
      <SimpleBackdrop open={sending} title="Please wait..." taille="10rem" />
      <Grid container>
        <Grid item lg={3}>
          <TextField fullWidth value={question} onChange={(event) => setQuestion(event.target.value)} label="Question" variant="outlined" />
        </Grid>
        <Grid item lg={3}>
          <Selected label="Type de question" data={type} value={typeSelect} setValue={setType} />
        </Grid>
        <Grid item lg={3}>
          <Box sx={{ display: 'flex' }}>
            <FormControl sx={{ m: 1 }} component="fieldset" variant="standard">
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
        {['select_one', 'select_many'].includes(typeSelect) && (
          <Grid item lg={3}>
            <TextField value={item} onChange={(event) => setItem(event.target.value)} label="Item" variant="outlined" />
            <input
              type="submit"
              onClick={() => {
                setAllItems([
                  ...allItems,
                  {
                    title: item,
                    id: new Date().getTime(),
                    next_question
                  }
                ]);
                setItem('');
                setNextQuestion('');
              }}
            />

            {data.length > 0 && (
              <select
                name="pets"
                id="pet-select"
                style={{
                  fontSize: '0.9rem',
                  padding: '2px 5px'
                }}
                value={next_question}
                onChange={(event) => setNextQuestion(event.target.value)}
              >
                <option value="">--Please choose an option--</option>
                {data.map((index, key) => {
                  return (
                    <option key={key} value={index.id}>
                      {index.question}
                    </option>
                  );
                })}
              </select>
            )}
          </Grid>
        )}
        <Grid item lg={3}>
          <Button onClick={() => changeData()} fullWidth variant="contained" color="primary">
            Save
          </Button>
        </Grid>
        <Grid item lg={3}>
          <Button onClick={() => sendData()} fullWidth variant="contained" color="primary">
            Enregistrer
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default AddQuestion;
