// material-ui
import { FormControl, InputAdornment, OutlinedInput } from '@mui/material';

// assets
import { SearchOutlined } from '@ant-design/icons';

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const Input = ({ label, setValue, value, showIcon }) => (
  <FormControl sx={{ width: '100%' }}>
    <OutlinedInput
      size="small"
      id="header-search"
      startAdornment={
        <InputAdornment position="start" sx={{ mr: -0.5 }}>
          {showIcon && <SearchOutlined />}
        </InputAdornment>
      }
      aria-describedby="header-search-text"
      inputProps={{
        'aria-label': 'weight'
      }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={label}
    />
  </FormControl>
);

export default Input;
