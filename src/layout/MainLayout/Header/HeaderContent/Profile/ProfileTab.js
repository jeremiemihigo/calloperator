import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
// assets
import { useSelector } from 'react-redux';
import { Settings, ChatBubble, PeopleAlt, Language, Person } from '@mui/icons-material';
// import {  FreeBreakfast, } from '@mui/icons-material';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

const ProfileTab = () => {
  const theme = useTheme();
  const navigation = useNavigate();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);

    if (index === 0) {
      navigation('/agent', { replace: true });
    }
    if (index === 1) {
      navigation('/region', { replace: true });
    }
    if (index === 2) {
      navigation('/clients', { replace: true });
    }
    if (index === 3) {
      navigation('/raison', { replace: true });
    }
    // if (index === 4) {
    //   navigation('/corbeille', { replace: true });
    // }
    if (index === 5) {
      navigation('/access', { replace: true });
    }
    if (index === 6) {
      navigation('/congeRH', { replace: true });
    }
  };

  const userConenct = useSelector((state) => state.user?.user);

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.grey[500] } }}>
      {userConenct && (userConenct.fonction === 'admin' || userConenct.fonction === 'superUser') && (
        <ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0)}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Agents" />
        </ListItemButton>
      )}
      {userConenct && (userConenct.fonction === 'admin' || userConenct.fonction === 'superUser') && (
        <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}>
          <ListItemIcon>
            <Language fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Regions" />
        </ListItemButton>
      )}

      <ListItemButton selected={selectedIndex === 2} onClick={(event) => handleListItemClick(event, 2)}>
        <ListItemIcon>
          <PeopleAlt fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Clients" />
      </ListItemButton>

      <ListItemButton selected={selectedIndex === 3} onClick={(event) => handleListItemClick(event, 3)}>
        <ListItemIcon>
          <ChatBubble fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Feedback de nos clients" />
      </ListItemButton>

      {userConenct && userConenct.fonction === 'superUser' && (
        <ListItemButton selected={selectedIndex === 5} onClick={(event) => handleListItemClick(event, 5)}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Accès" />
        </ListItemButton>
      )}
      {/* <ListItemButton selected={selectedIndex === 6} onClick={(event) => handleListItemClick(event, 6)}>
        <ListItemIcon>
          <FreeBreakfast fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Congé" />
      </ListItemButton> */}
    </List>
  );
};

ProfileTab.propTypes = {
  handleLogout: PropTypes.func
};

export default ProfileTab;
