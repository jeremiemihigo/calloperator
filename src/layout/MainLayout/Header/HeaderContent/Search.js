// material-ui
import { Box, FormControl } from '@mui/material';
import { useSelector } from 'react-redux';

// assets

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const Search = () => {
  const menu = useSelector((state) => state.menu);
  return (
    <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}>
      <FormControl sx={{ width: { xs: '100%', md: 224 } }}>{menu && menu.openItem.length > 0 && menu.openItem[0]}</FormControl>
    </Box>
  );
};

export default Search;
