/* eslint-disable react/prop-types */
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const filter = createFilterOptions();

function AutoComplement({ value, setValue, options, title, propr }) {
  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          setValue({
            title: newValue
          });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue({
            title: newValue.inputValue
          });
        } else {
          setValue(newValue);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with"
      options={options}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option['' + propr];
      }}
      renderOption={(props, option) => (
        <li key={option.id} {...props}>
          {option['' + propr]}
        </li>
      )}
      sx={{ width: '100%' }}
      freeSolo
      renderInput={(params) => <TextField {...params} label={title || 'Titre'} />}
    />
  );
}
export default AutoComplement;
