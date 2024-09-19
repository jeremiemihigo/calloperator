import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// assets
import { DeveloperMode, Language, PeopleAlt, Person } from '@mui/icons-material';

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

    if (index === 3) {
      itemHandler('Access');
      navigation('/access', { replace: true });
    }
    // if (index === 4) {
    //   itemHandler('My_leave');
    //   navigation('/conge', { replace: true });
    // }
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
        <ListItemButton selected={selectedIndex === 3} onClick={(event) => handleListItemClick(event, 3)}>
          <ListItemIcon>
            <DeveloperMode fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Permissions" />
        </ListItemButton>
      )}
      {/* <ListItemButton selected={selectedIndex === 4} onClick={(event) => handleListItemClick(event, 4)}>
        <ListItemIcon>
          <FreeBreakfast fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="My_leave" />
      </ListItemButton> */}
    </List>
  );
};

ProfileTab.propTypes = {
  handleLogout: PropTypes.func
};

export default ProfileTab;
