import { Autocomplete, Paper, TextField } from '@mui/material';
import _ from 'lodash';
import React from 'react';
import { ContextFeedback } from '../Context';
import SaveComponent from './SaveComponent';

function Injoignable() {
  const { client } = React.useContext(ContextFeedback);

  const [phoneNumber, setPhoneNumber] = React.useState([]);
  const [numberSelect, setNumberSelect] = React.useState([]);
  React.useEffect(() => {
    if (client) {
      const { first_number, second_number, payment_number } = client;
      setPhoneNumber(_.uniq([first_number, second_number, payment_number]).filter((x) => x !== ''));
    }
  }, [client]);

  return (
    <Paper sx={{ padding: '10px' }}>
      <div style={{ marginTop: '10px' }}>
        <Autocomplete
          multiple
          value={numberSelect}
          disabled={phoneNumber.length === 0 ? true : false}
          id="tags-outlined"
          onChange={(event, newValue) => {
            if (typeof newValue === 'string') {
              setNumberSelect({
                title: newValue
              });
            } else if (newValue && newValue.inputValue) {
              // Create a new value from the user input
              setNumberSelect({
                title: newValue.inputValue
              });
            } else {
              setNumberSelect(newValue);
            }
          }}
          options={phoneNumber}
          getOptionLabel={(option) => option}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label="Phone number"
              placeholder={phoneNumber.length === 0 ? 'No Phone number upload for this customer' : 'Select a number'}
            />
          )}
        />
      </div>

      {numberSelect.length > 0 && (
        <SaveComponent
          donner={{
            type: 'Unreachable',
            contact: numberSelect.join(';')
          }}
        />
      )}
    </Paper>
  );
}

export default Injoignable;
