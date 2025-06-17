import { Autocomplete, TextField } from "@mui/material";

function AutoSelectMany({ value, setValue, title, options, propr }) {
  return (
    <div style={{ marginTop: "10px", width: "100%" }}>
      <Autocomplete
        multiple
        value={value}
        fullWidth
        id="tags-outlined"
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
            setValue({
              title: newValue,
            });
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            setValue({
              title: newValue.inputValue,
            });
          } else {
            setValue(newValue);
          }
        }}
        options={options}
        getOptionLabel={(option) => option["" + propr]}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField fullWidth {...params} label={title} placeholder={title} />
        )}
      />
    </div>
  );
}

export default AutoSelectMany;
