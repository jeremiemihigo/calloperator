import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// assets
import { DonutLarge, Language, PeopleAlt, Person, Settings } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { activeItem } from 'store/reducers/menu';
// import {  FreeBreakfast, } from '@mui/icons-material';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

const ProfileTab = () => {
  const theme = useTheme();
  const navigation = useNavigate();
  const dispatch = useDispatch();

  const itemHandler = (id) => {
    dispatch(activeItem({ openItem: [id] }));
  };

  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    if (index === 0) {
      itemHandler('Agent');
      navigation('/agent', { replace: true });
    }
    if (index === 1) {
      itemHandler('Region');
      navigation('/region', { replace: true });
    }
    if (index === 2) {
      itemHandler('Clients');
      navigation('/clients', { replace: true });
    }

    if (index === 5) {
      itemHandler('Access');
      navigation('/access', { replace: true });
    }
    if (index === 6) {
      itemHandler('agent');
      navigation('/congeRH', { replace: true });
    }
    if (index === 7) {
      itemHandler('Plainte');
      navigation('/plainte', { replace: true });
    }
    if (index === 8) {
      itemHandler('Delai');
      navigation('/delai', { replace: true });
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
        <ListItemText primary="Customers" />
      </ListItemButton>
      {userConenct && userConenct.fonction === 'superUser' && (
        <ListItemButton selected={selectedIndex === 5} onClick={(event) => handleListItemClick(event, 5)}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Permissions" />
        </ListItemButton>
      )}
      {userConenct && userConenct.fonction === 'superUser' && (
        <ListItemButton selected={selectedIndex === 7} onClick={(event) => handleListItemClick(event, 7)}>
          <ListItemIcon>
            <DonutLarge fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Complaint" />
        </ListItemButton>
      )}
      {userConenct && userConenct.fonction === 'superUser' && (
        <ListItemButton selected={selectedIndex === 8} onClick={(event) => handleListItemClick(event, 8)}>
          <ListItemIcon>
            <DonutLarge fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delai" />
        </ListItemButton>
      )}
    </List>
  );
};

ProfileTab.propTypes = {
  handleLogout: PropTypes.func
};

export default ProfileTab;
