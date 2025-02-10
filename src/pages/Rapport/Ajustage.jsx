/* eslint-disable react/prop-types */
import { Checkbox, FormControl, FormControlLabel, FormGroup, Grid, Typography } from '@mui/material';
import { Alert, Input, Space } from 'antd';
import axios from 'axios';
import BoutonComponent from 'Control/Bouton';
import React from 'react';
import { lien } from 'static/Lien';

function Ajustage({ feedback, loading }) {
  const [value, setValue] = React.useState([]);
  const [message, setMessage] = React.useState();

  const handleChange = (item, e) => {
    e.preventDefault();
    if (value.includes(item)) {
      setValue(value.filter((x) => x !== item));
    } else {
      setValue([...value, item]);
    }
  };
  const [raison, setRaison] = React.useState('');

  const sending = async () => {
    const data = {
      table: value,
      value: raison
    };
    const response = await axios.post(lien + '/ajuster', data);
    loading();
    setMessage(response);
    setRaison('');
  };

  React.useEffect(() => {
    setMessage();
    setValue([]);
  }, [feedback]);
  return (
    <div>
      {message && message.status === 200 && (
        <Space
          direction="vertical"
          style={{
            width: '100%',
            marginBottom: '10px'
          }}
        >
          <Alert message={`${message.data.modifiedCount} visites ont été modifiées`} type="success" showIcon />
        </Space>
      )}
      <Grid container>
        {feedback.map((index, key) => {
          return (
            <Grid item lg={6} key={key}>
              <FormControl component="fieldset" variant="standard">
                <FormGroup>
                  <FormControlLabel
                    onClick={(e) => handleChange(index, e)}
                    control={<Checkbox name={index} checked={value.includes(index)} />}
                    label={index}
                  />
                </FormGroup>
              </FormControl>
            </Grid>
          );
        })}
      </Grid>
      <Typography component="p">Form</Typography>
      <Grid container>
        <Grid item lg={12}>
          <Input type="text" placeholder="Feedback" value={raison} onChange={(e) => setRaison(e.target.value)} />
        </Grid>
      </Grid>
      <Grid sx={{ marginTop: '12px' }}>
        <BoutonComponent type="primary" title="Midifier" disabled={value.length < 1 || raison === ''} fonction={sending} />
      </Grid>
    </div>
  );
}

export default Ajustage;
