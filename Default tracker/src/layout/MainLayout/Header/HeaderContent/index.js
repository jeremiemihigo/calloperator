// material-ui
// import { IconButton, Link } from '@mui/material';
import { Box, Typography, useMediaQuery } from '@mui/material';
// import { GithubOutlined } from '@ant-design/icons';
// project import
import React from 'react';
import { useSelector } from 'react-redux';
import MobileSection from './MobileSection';
import Profile from './Profile';

// ==============================|| HEADER - CONTENT ||============================== //
import { useNavigate } from 'react-router-dom';
import FirstLogin from './FirstLogin';
// import Notification from './Notification';
const HeaderContent = () => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (user.readUser === 'rejected') {
      navigate('/login');
    }
  }, [user]);
  const returnPoste = (utilisateur) => {
    if (utilisateur && utilisateur?.valuefilter && utilisateur.valuefilter.length > 0) {
      return '(' + utilisateur.valuefilter.join('; ') + ')';
    } else {
      return '';
    }
  };

  return (
    <>
      {!matchesXs && (
        <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}>
          {user.readUser === 'success' && user?.user?.poste.length > 0 && (
            <Typography variant="h6" color="default" sx={{ fontWeight: 'bolder' }}>
              {user?.user.poste[0]?.title.toUpperCase() + ' '}
              {returnPoste(user?.user)}
            </Typography>
          )}
        </Box>
      )}
      {user?.first && <FirstLogin />}
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}
      {/* <Notification /> */}
      {!matchesXs && <Profile />}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
