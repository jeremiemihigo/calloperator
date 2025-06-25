import PropTypes from 'prop-types';

// material-ui
import { Box, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Dot = ({ texte, ...others }) => {
  const theme = useTheme();
  let main;
  switch (texte) {
    case 'No_visits':
      main = theme.palette.primary.main;
      break;
    case 'En cours':
      main = theme.palette.secondary.main;
      break;
    case 'Achevé':
      main = theme.palette.success.main;
      break;
    case 'Categorisation':
      main = theme.palette.primary.main;
      break;
    case 'No_calls':
      main = theme.palette.primary.main;
      break;
    case 'Tracking_Ongoing':
      main = theme.palette.primary.main;
      break;
    case 'No_Action':
      main = theme.palette.primary.main;
      break;
    case 'No_people':
      main = theme.palette.primary.main;
      break;
    case 'Pending':
      main = theme.palette.primary.main;
      break;
    case 'error':
      main = theme.palette.primary.main;
      break;
    case 'Rejected':
      main = theme.palette.warning.main;
      break;
    case 'visited':
      main = theme.palette.success.main;
      break;
    case 'success':
      main = theme.palette.success.main;
      break;
    case 'Approved':
      main = theme.palette.success.main;
      break;
    default:
      main = theme.palette.warning.main;
  }

  return (
    <Box
      {...others}
      sx={{
        margin: 0,
        padding: '0px 3px',
        borderRadius: '2px',
        width: '100%',
        textAlign: 'center',
        cursor: 'pointer',
        bgcolor: main
      }}
    >
      <Tooltip title={texte}>
        <Typography noWrap>{texte}</Typography>
      </Tooltip>
    </Box>
  );
};

Dot.propTypes = {
  texte: PropTypes.string
};

export default Dot;
