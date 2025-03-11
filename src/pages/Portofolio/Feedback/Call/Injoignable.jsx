import { Paper, TextField } from '@mui/material';
import React from 'react';
import SaveComponent from './SaveComponent';

function Injoignable() {
  const [number, setNumber] = React.useState('');

  const [allNumber, setAllNumber] = React.useState([]);
  const addAnOther = (event) => {
    event.preventDefault();
    if (number !== '' && !allNumber.includes(number.trim())) {
      setAllNumber([...allNumber, number.trim()]);
      setNumber('');
    }
  };
  const deleteOne = (number) => {
    setAllNumber(allNumber.filter((x) => x !== number));
  };

  return (
    <Paper sx={{ padding: '10px' }}>
      {allNumber.map((index, key) => {
        return (
          <div key={key} style={{ marginBottom: '5px', display: 'flex', justifyContent: 'left' }}>
            <TextField sx={{ width: '70%' }} variant="outlined" type="text" value={index} />
            <input type="submit" value="Delete" onClick={() => deleteOne(index)} />
          </div>
        );
      })}
      <div style={{ marginBottom: '5px', display: 'flex', justifyContent: 'left' }}>
        <TextField
          value={number}
          sx={{ width: '70%' }}
          variant="outlined"
          onChange={(event) => setNumber(event.target.value)}
          label={allNumber.length > 0 ? 'Ajoutez un autre numero de telephone injoignable' : 'Numero de telephone'}
        />
        <input onClick={(event) => addAnOther(event)} type="submit" value="Add" />
      </div>
      {allNumber.length > 0 && (
        <SaveComponent
          donner={{
            type: 'Unreachable',
            contact: allNumber.join(',')
          }}
        />
      )}
    </Paper>
  );
}

export default Injoignable;
