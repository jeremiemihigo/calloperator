import PropTypes from 'prop-types';

// material-ui
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Couleur = ({ text, taille, ...others }) => {
  const theme = useTheme();
  let main;
  switch (text) {
    case 'OUT SLA':
      main = theme.palette.warning.main;
      break;
    case 'Ouvert':
      main = theme.palette.warning.main;
      break;
    case 'Complaint to close':
      main = theme.palette.warning.main;
      break;
    case 'IN SLA':
      main = theme.palette.info.main;
      break;
    case 'Fermer':
      main = theme.palette.success.main;
      break;
    case 'closed':
      main = theme.palette.success.main;
      break;
    case 'resolved':
      main = theme.palette.success.main;
      break;
    default:
      main = theme.palette.secondary.main;
  }
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return (
    <Box
      sx={{
        width: '100%',
        height: '50%',
        textAlign: 'center',
        color: 'white',
        borderRadius: '2px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        bgcolor: main,
        fontSize: taille || 12
      }}
      {...others}
    >
      {text && capitalizeFirstLetter(text)}
    </Box>
  );
};

Couleur.propTypes = {
  color: PropTypes.string,
  taille: PropTypes.number
};

export default Couleur;
