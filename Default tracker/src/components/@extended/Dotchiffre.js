import PropTypes from 'prop-types';

// material-ui
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Dotchiffre = ({ nombre }) => {
  const theme = useTheme();
  let main;
  if (nombre < 0) {
    main = theme.palette.warning.main;
  }
  if (nombre >= 0) {
    main = theme.palette.success.main;
  }

  return (
    <Box
      sx={{
        margin: 0,
        padding: '0px 3px',
        borderRadius: '2px',
        width: '100%',
        textAlign: 'center',
        bgcolor: main
      }}
    >
      {nombre}%
    </Box>
  );
};

Dotchiffre.propTypes = {
  nombre: PropTypes.number
};

export default Dotchiffre;
