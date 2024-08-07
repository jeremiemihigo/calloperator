// material-ui
import { Box, useMediaQuery } from '@mui/material';

// project import
import Connected from './Connected';
import MobileSection from './MobileSection';
import Profile from './Profile';
import Search from './Search';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));
  return (
    <>
      {!matchesXs && <Search />}
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}
      <Connected />
      {!matchesXs && <Profile />}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
