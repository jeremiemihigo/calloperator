import PropTypes from 'prop-types';

// material-ui

// project import
import Logo from './Logo';

// ==============================|| DRAWER HEADER ||============================== //

const DrawerHeader = ({ open }) => {
  return (
    // only available in paid version

    <Logo />
  );
};

DrawerHeader.propTypes = {
  open: PropTypes.bool
};

export default DrawerHeader;
