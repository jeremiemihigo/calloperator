import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { DonutLarge } from '@mui/icons-material';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { activeItem } from 'store/reducers/menu';
import { Message } from '../../../../../../node_modules/@mui/icons-material/index';
// assets
// import {  FreeBreakfast, } from '@mui/icons-material';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

const Setting_Call = () => {
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
      itemHandler('Plainte');
      navigation('/plainte', { replace: true });
    }
    if (index === 1) {
      itemHandler('Delai');
      navigation('/delai', { replace: true });
    }
    if (index === 2) {
      itemHandler('Communication');
      navigation('/communication', { replace: true });
    }
  };
  const userConenct = useSelector((state) => state.user?.user);

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.grey[500] } }}>
      {userConenct && userConenct.fonction === 'superUser' && (
        <ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0)}>
          <ListItemIcon>
            <DonutLarge fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Complaints" />
        </ListItemButton>
      )}
      {userConenct && userConenct.fonction === 'superUser' && (
        <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}>
          <ListItemIcon>
            <DonutLarge fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Deedline" />
        </ListItemButton>
      )}
      {userConenct && userConenct.fonction === 'superUser' && (
        <ListItemButton selected={selectedIndex === 2} onClick={(event) => handleListItemClick(event, 2)}>
          <ListItemIcon>
            <Message fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Communication" />
        </ListItemButton>
      )}
      {/* {userConenct && userConenct.fonction === 'superUser' && (
        <ListItemButton selected={selectedIndex === 2} onClick={(event) => handleListItemClick(event, 2)}>
          <ListItemIcon>
            <DonutLarge fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Valve" />
        </ListItemButton>
      )} */}
    </List>
  );
};

Setting_Call.propTypes = {
  handleLogout: PropTypes.func
};

export default Setting_Call;
