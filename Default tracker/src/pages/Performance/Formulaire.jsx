import { Send } from '@mui/icons-material';
import { Button, Grid } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { Mention, MentionsInput } from 'react-mentions';
import { config, lien_dt } from 'static/Lien';
import { CreateContextePerformance } from './Context';
import './performance.style.css';
import { table_keys } from './template';

const mentionInputStyle = {
  control: {
    backgroundColor: '#fff',
    fontSize: 14,
    fontWeight: 'normal'
  },
  highlighter: {
    overflow: 'hidden'
  },
  input: {
    margin: 0,
    padding: 5,
    margin: 5,
    fontSize: '13px'
  },
  suggestions: {
    list: {
      backgroundColor: 'white',
      border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 14
    },
    item: {
      padding: '5px 15px',
      borderBottom: '1px solid #ddd',
      '&focused': {
        backgroundColor: '#cee4e5'
      }
    }
  },
  mention: {
    backgroundColor: '#e6f3ff',
    color: 'red',
    fontWeight: 'bolder'
  }
};

function FormulairePerformance() {
  //title, source_feedback
  const [values, setValues] = React.useState('');
  const { dataexcel, setResult } = React.useContext(CreateContextePerformance);

  const handleChange = (event, newValue, plainTextValue, mentions) => {
    setValues(newValue); // newValue contient les mentions encodées comme `@[Alice](user:1)`
  };
  console.log(values);
  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${lien_dt}/sendmessage`, { values, agents: dataexcel }, config);
      if (response.status === 200) {
        setResult(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {dataexcel && dataexcel.length > 0 && (
        <Grid container>
          <Grid item lg={12}>
            <MentionsInput
              className="messagemention"
              value={values}
              onChange={handleChange}
              style={mentionInputStyle}
              placeholder="Message"
            >
              <Mention
                className="mentiones"
                trigger="@"
                data={table_keys}
                markup="@__display__"
                displayTransform={(id, display) => `@${display}`}
              />
            </MentionsInput>
          </Grid>
          <Grid item lg={6} sx={{ marginTop: '20px' }}>
            <Button onClick={(event) => sendMessage(event)} fullWidth color="primary" variant="contained">
              <Send fontSize="small" /> <span style={{ marginLeft: '10px' }}>Envoyer</span>
            </Button>
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default FormulairePerformance;
