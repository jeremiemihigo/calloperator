import { Autocomplete, Stack, TextField } from '@mui/material';

function AutoCompleteArray({ setValue, value, data, title }) {
  return (
    <Stack spacing={3} sx={{ width: '100%', margin: '10px 0px' }}>
      <Autocomplete
        multiple
        value={value}
        id="tags-outlined"
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
        options={data}
        getOptionLabel={(option) => option}
        filterSelectedOptions
        renderInput={(params) => <TextField {...params} label={title} placeholder={title} />}
      />
    </Stack>
  );
}

export default AutoCompleteArray;
