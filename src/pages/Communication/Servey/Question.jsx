import { Add } from '@mui/icons-material';
import { Alert, Button, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { config, lien_terrain } from 'static/Lien';
import Selected from 'static/Select';

function Question({ idServey }) {
  const [question, setQuestion] = React.useState('');
  const types = [
    { id: 1, title: 'Select one', value: 'select_one' },
    { id: 2, title: 'Select many', value: 'select_many' },
    { id: 3, title: 'text', value: 'text' },
    { id: 4, title: 'date', value: 'date' }
  ];
  const [typeSelect, setTypeSelect] = React.useState('');
  const [message, setMessage] = React.useState();

  const [item, setItem] = React.useState('');
  const [allItem, setAllItem] = React.useState([]);
  const sendData = async () => {
    try {
      const response = await axios.post(
        `${lien_terrain}/question`,
        {
          question,
          type_reponse: typeSelect ? typeSelect : 'text',
          idServey,
          item: allItem
        },
        config
      );
      if (response.status === 200) {
        setMessage('Done');

        setTypeSelect('');
        setQuestion('');
      } else {
        setMessage(JSON.stringify(response.data));
      }
    } catch (error) {
      setMessage(JSON.stringify(error));
    }
  };

  return (
    <div style={{ minWidth: '20rem', padding: '10px' }}>
      <div style={{ marginBottom: '5px' }}> {message && <Alert>{message}</Alert>}</div>
      <div style={{ marginBottom: '10px' }}>
        <TextField
          onChange={(e) => {
            setQuestion(e.target.value);
            setMessage();
          }}
          name="question"
          id="outlined-multiline-static"
          label="Question"
          fullWidth
        />
      </div>
      <div>
        <Selected label="Select" data={types} value={typeSelect} setValue={setTypeSelect} />
      </div>
      {typeSelect && ['select_one', 'select_many'].includes(typeSelect) && (
        <>
          <Grid container sx={{ margin: '10px 0px' }}>
            <Grid item lg={item ? 10 : 12}>
              <TextField
                onChange={(e) => {
                  setItem(e.target.value);
                  setMessage();
                }}
                value={item}
                name="question"
                id="outlined-multiline-static"
                label="Item"
                fullWidth
              />
            </Grid>

            {item && (
              <Grid item lg={2} sx={{ display: 'flex', paddingLeft: '4px', alignItems: 'center' }}>
                <Button
                  onClick={() => {
                    setAllItem([...allItem, item]);
                    setItem('');
                  }}
                  variant="contained"
                  color="secondary"
                >
                  <Add fontSize="small" />
                </Button>{' '}
              </Grid>
            )}
          </Grid>
          <div>
            {allItem.map((index, key) => {
              return (
                <Typography
                  onClick={() => {
                    setAllItem(allItem.filter((x) => x !== index));
                  }}
                  component="p"
                  key={key}
                >
                  {index} <span style={{ marginLeft: '10px', cursor: 'pointer', fontSize: '10px', color: 'red' }}>Delete</span>
                </Typography>
              );
            })}
          </div>
        </>
      )}

      <div style={{ marginTop: '10px' }}>
        <Button fullWidth onClick={() => sendData()} variant="contained" color="primary">
          Valider
        </Button>
      </div>
    </div>
  );
}

export default Question;
